class Simple1111Api {
  constructor(_url) {
    this.auto1111Url = _url;

    this.isGenerating = false;
    this.isAsking = false;
    this.isSpeaking = false;
    this.hasBase64 = false;
    this.state = "showCanvas";

    this.model_list;
    this.modelNumber = 0;
    this.res = 512;
    this.seed = random(0, 4294967294);

    this.img = createImage(this.res, this.res);
    this.cimg = createImage(this.res, this.res);
    this.txt = "No Clip generated yet ...";
    this.isReady = false;

    this.events = {};
  }

  setSeed(seed) {
    this.seed = seed;
  }

  resetBooleans(imageRelated = false) {
    this.isGenerating = false;
    this.isAsking = false;

    if (imageRelated) {
      this.hasBase64 = false;
      this.isSpeaking = false;
    }
  }

  async txtToImg(_prompt, _controlnetImg, _controlnetModel) {
    let prompt;
    if (_prompt) {
      prompt = _prompt;
    }

    let controlnetImg;
    if (_controlnetImg) {
      controlnetImg = _controlnetImg;
    }

    let controlnetModel = this.model_list[this.modelNumber];
    if (_controlnetModel) {
      controlnetModel = _controlnetModel;
    }

    let payload;
    let url = this.auto1111Url + "sdapi/v1/txt2img/";

    if (_prompt) {
      this.isGenerating = true;
      payload = {
        prompt: prompt,
        steps: 20,
        cfg_scale: 7,
        width: this.res,
        height: this.res,
        seed: this.seed,

        alwayson_scripts: {},
      };

      if (controlnetImg && controlnetModel) {
        payload.alwayson_scripts = {
          controlnet: {
            args: [
              {
                enabled: true,
                image: controlnetImg.canvas.toDataURL(),
                module: "none",
                model: controlnetModel,
                weight: 0.8,
              },
            ],
          },
        };
      } else {
        console.log(
          "Proceeding without Controlnet Image and a Controlnet Model ..."
        );
      }

      let genImage = await httpPost(url, "json", payload);
      let imgBase64 = genImage.images[0];
      this.img = loadImage("data:image/png;base64," + imgBase64);

      return imgBase64;
    } else {
      console.log("Need at least a prompt ...");
    }
  }

  async imgToTxt(_img) {
    let img;
    if (_img) {
      img = _img;
    }
    let url = this.auto1111Url + "sdapi/v1/interrogate";
    let payload;
    let clipStr;

    if (img) {
      this.isGenerating = true;

      payload = {
        image: img.canvas.toDataURL(),
        model: "clip",
      };
      let t = await httpPost(url, "json", payload);
      this.txt = t.caption;
      console.log(this.txt);
      this.isGenerating = false;
    } else {
      console.log("Need an Image ...");
    }
  }

  async imgToControlnet(_img, _controlnetModule) {
    let payload;

    let img;
    if (_img) {
      img = _img;
    }

    let controlnetModule = _controlnetModule;
    for (const model in this.model_list) {
      // console.log(this.model_list[model]);
      if (this.model_list[model].search(controlnetModule) != -1) {
        this.modelNumber = model;
        // console.log(this.modelNumber);
        break;
      }
    }

    let controlnetModel = this.model_list[this.modelNumber];

    //let tmpImg = img.canvas.toDataURL().toString();
    if (img) {
      this.isGenerating = true;

      payload = {
        controlnet_module: controlnetModule,
        model: controlnetModel,
        controlnet_input_images: [img.canvas.toDataURL().toString()],
      };
      // console.log(payload);
      let i = await httpPost(
        this.auto1111Url + "controlnet/detect",
        "application/json",
        payload
      );
      this.cimg = loadImage("data:image/png;base64," + JSON.parse(i).images[0]);
      this.isGenerating = false;
    } else {
      console.log("Need an Image, Controlnet Type and Controlnet Model");
    }
  }

  async getControlnetInfo() {
    print("Hello ControlnNet!");
    let url = this.auto1111Url + "controlnet/model_list";

    let list;
    let test = true;
    //list = await httpGet(url, 'json', false, function(response) {test = true},  function(error) {test = false; alert("not valid url ...")});

    list = await this.#testfunction(url);
    this.isReady = test;

    if (this.isReady == true) {
      this.model_list = list.model_list;
    }

    /*
    url = this.auto1111Url + '/controlnet/module_list';
    httpGet(url, 'json', false, function(response) {
    console.log(response);
    });
    */
  }

  async #testfunction(_url) {
    const url = _url;
    try {
      const response = await fetch(_url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }
}
