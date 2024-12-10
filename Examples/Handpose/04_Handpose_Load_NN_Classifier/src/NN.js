class NN{
    constructor(){
      this.options = {
        task: "classification",
        debug: true,
      };
      this.classifier = ml5.neuralNetwork(this.options);
      this.isTrained = false;
      this.label = "no Label";
      
    }
    
    
    addExample(input, target) {
      if (input) {
        this.classifier.addData(input, [target]);
      }
    }
  
    trainModel() {
      this.classifier.normalizeData();
       const trainingOptions = {
        epochs: 32,
        batchSize: 12,
      };
      this.classifier.train(trainingOptions, this.finishedTraining.bind(this));
    }
  
    finishedTraining() {
      print("Training finished")
      this.isTrained = true;
    }
    
    classify(input){
      this.classifier.classify(input, this.handleResults.bind(this));
  
    }
    
    handleResults(results, error) {
      if (error) {
        console.error(error);
        return;
      }
      this.label = results[0].label;
    }
  
    saveModel()
    {
      if(this.isTrained == true)
      {
        this.classifier.save();  
      }
    }
    
  }
  