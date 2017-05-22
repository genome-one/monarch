import React, { Component } from 'react';
import Triptych from './../../components/Triptych/Triptych'
import dataOwlsim from './testData.owlsim'

export default class OwlsimTriptych extends Component {
  constructor(props) {
    super(props);
    var data = this.callOwlsimApi();
    this.state = {
      data: this.processDataForTriptych(data)
    }
  }
  
  callOwlsimApi() {
    // TODO
    return dataOwlsim();  
  }
  
  processDataForTriptych(data) {
    var newArr = [],
        maxMaxIC = data.results[0].system_stats.maxMaxIC;
    data.results[0].matches.forEach((match) => {
      newArr.push({
        phenotype1: { label: match.a.label, informationContent: parseFloat(match.a.IC).toFixed(2) },
        phenotype2: { label: match.b.label, informationContent: parseFloat(match.b.IC).toFixed(2) },
        similarity: this.calSimScore(match.a.IC, match.b.IC, match.lcs.IC, maxMaxIC)
      });
    })
    
    newArr.sort((a, b) => {
      return b.similarity - a.similarity;
    })
    
    return newArr;
  }
  
  calSimScore(aIC, bIC, lcsIC, maxMaxIC ) {
    var distance = Math.sqrt(Math.pow(aIC - lcsIC, 2) 
        + Math.pow(bIC - lcsIC, 2)); 
    var similarity = parseFloat((1 - (distance / maxMaxIC)) * 100).toFixed(1);
    
    return similarity;
  }
  
  render() {
    return (
      <div>
        <Triptych data={this.state.data} />
      </div>
    );
  }
}

