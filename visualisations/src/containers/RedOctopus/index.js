import React, { Component } from 'react';
import dataAchondroplasia from './testData.achondroplasia';
import dataPseudoAchondroplasia from './testData.pseudoachondroplasia';
import dataAlkaptonuria from './testData.alkaptonuria';
import dataPhenylketonuria from './testData.phenylketonuria';
import dataTetraploidy from './testData.tetraploidy';
import dataTriploidy from './testData.triploidy';
import Radar from './../../components/Radar/Radar'

export default class RedOctopus extends Component {
  constructor(props) {
    super(props);
    this.changeHighLevel = this.changeHighLevel.bind(this);
    this.state = {
      highLevel: []
    }
  }
  
  componentWillMount() {
    //this.changeHighLevel(dataAchondroplasia(), dataPseudoAchondroplasia());
    //this.changeHighLevel(dataAlkaptonuria(), dataPhenylketonuria());
    this.changeHighLevel(dataTetraploidy(), dataTriploidy());
  }
  
  getPhenotypeClassifications(dataArr) {
    var cArr = []
    dataArr.forEach((data) => {
      data.phenotypes.forEach((pheno) => {
        var dupe = false;
        pheno.phenotype.classification.forEach((classification) => {
          cArr.forEach((item) => {
            if(item.axis === classification.name) {
              dupe = true;
            }
          });
          
          if(!dupe) cArr.push({axis: classification.name, value: 0})
        });
      });
    });
    
    return cArr;
  }
  
  countClassification(classifications, data) {
    var arr =  JSON.parse(JSON.stringify(classifications)); //Deep cloning an array of objects.
    data.phenotypes.forEach((pheno) => {
      pheno.phenotype.classification.forEach((classification) => {
          arr.forEach((item) => {
            if(item.axis === classification.name) {
              item.value++;
            }
          });
        });
    });

    return arr;
  }
  
  changeHighLevel(dataA, dataB) {
    var initClassificationArray = this.getPhenotypeClassifications([
      dataA, dataB
    ]);
    
    this.setState({
      highLevel: [
        this.countClassification(initClassificationArray, dataA),
        this.countClassification(initClassificationArray, dataB)
      ]
    })
  }
  
  render() {
    return (
      <div>
        <Radar data={this.state.highLevel} />
      </div>
    );
  }
}

