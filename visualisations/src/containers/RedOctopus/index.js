import React, { Component } from 'react';
import { 
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  Glyphicon
} from 'react-bootstrap';
import styled from 'styled-components';
//import Select from 'react-select';
import { /*getDiseaseOptions,*/ getComparedAttributeSets } from './apis';
import { 
  getPhenotypeClassifications, 
  initClassedPhenotype, 
  populateClassedPhenotype 
} from './data.phenoClass';
import { initRadarAxisData, countForRadar } from './data.radar';
import { initTableData, populateTableData } from './data.table';
import { generateTriptychQueryString, processDataForTriptych } from './data.triptych';
import dataAchondroplasia from './testData.achondroplasia';
import dataPseudoAchondroplasia from './testData.pseudoachondroplasia';
import dataAlkaptonuria from './testData.alkaptonuria';
import dataPhenylketonuria from './testData.phenylketonuria';
import dataTetraploidy from './testData.tetraploidy';
import dataTriploidy from './testData.triploidy';
import Radar from './../../components/Radar/Radar';
import Triptych from './../../components/Triptych/Triptych';
import TableDiseaseMatch from './../../components/TableDiseaseMatch/TableDiseaseMatch';

const Header = styled.div`
  background: #000;
  height: 52px;
  padding: 8px 24px 8px 24px;
  color: #eee;
  
  b {
    font-size: 16px;
  }

  & > * {
    display:inline-block;
    margin-right: 24px;
    vertical-align: middle;
  }
`;

const Left = styled.div`
  float: left;
  padding-left: 24px;
`;

const Right = styled.div`
  float: right;
  padding: 24px 64px 24px 32px;
`;

const SpinningLogo = styled(Glyphicon)`
  margin-right: 6px;
  -webkit-animation: spin 1000ms infinite linear;
  animation: spin 1000ms infinite linear;
`;

/*const Search = styled(Select.Async)`
  width: 200px;
  font-size: 13px;
`;*/

export default class RedOctopus extends Component {
  constructor(props) {
    super(props);
    //this.selectDiseaseA = this.selectDiseaseA.bind(this);
    //this.selectDiseaseB = this.selectDiseaseB.bind(this);
    this.updateVisualisation = this.updateVisualisation.bind(this);
    this.updateTriptych = this.updateTriptych.bind(this);
    this.state = {
      diseaseA: {},
      diseaseB: {},
      //diseaseAData: dataAchondroplasia(),
      //diseaseBData: dataPseudoAchondroplasia(),
      classedPhenotypeA: {},
      classedPhenotypeB: {},
      table: [],
      radar: [],
      triptych: []
    }
  }
  
  componentWillMount() {
    this.updateVisualisation(dataAchondroplasia(), dataPseudoAchondroplasia());
  }
  
  componentDidUpdate(nextProps, prevProps) {
    if(
      this.state.diseaseA.value && 
      this.state.diseaseB.value && 
      (this.state.diseaseA.value !== prevProps.diseaseA.value || this.state.diseaseB.value !== prevProps.diseaseB.value)
    ) {
      // TODO
    }
  }
  /*
  selectDiseaseA(value) { this.setState({diseaseA: value}) }
  selectDiseaseB(value) { this.setState({diseaseB: value}) }
  */
  
  updateVisualisation(dataA, dataB) {
    var classifications = getPhenotypeClassifications([dataA, dataB]);
    var classPhenoUnpopulated = initClassedPhenotype(classifications);
    var classPhenotypeA = populateClassedPhenotype(classPhenoUnpopulated, dataA);
    var classPhenotypeB = populateClassedPhenotype(classPhenoUnpopulated, dataB);
    var radarAxis = initRadarAxisData(classifications);
    var tableData = initTableData(classifications);
    populateTableData(tableData, 'diseaseA', dataA);
    populateTableData(tableData, 'diseaseB', dataB);
    this.updateTriptych(classPhenotypeA, classPhenotypeB, dataA.name, dataB.name);
    this.setState({
      classedPhenotypeA: classPhenotypeA,
      classedPhenotypeB: classPhenotypeB,
      radar: [
        countForRadar(radarAxis, dataA),
        countForRadar(radarAxis, dataB)
      ],
      table: tableData,
      triptych: []
    })
  }
  
  updateTriptych(classPhenotypeA, classPhenotypeB, profileNameA, profileNameB) {
    var triptychQString = generateTriptychQueryString(classPhenotypeA, classPhenotypeB);
    getComparedAttributeSets(triptychQString)
      .then((data) => {
        this.setState({
          triptych: processDataForTriptych(data, profileNameA, profileNameB)
        });
      });
  }
  
  render() {
    return (
      <div>
        <Header>
          <b>Monarch Disease Comparison</b>
          {/*}
          <Search
            name="diseaseA"
            value={this.state.diseaseA}
            isLoading={true}
            loadOptions={getDiseaseOptions}
            onChange={this.selectDiseaseA}
          />
          <Search
            name="diseaseB"
            value={this.state.diseaseB}
            isLoading={true}
            loadOptions={getDiseaseOptions}
            onChange={this.selectDiseaseB}
          />
          {*/}
          
          <ButtonToolbar>
            <DropdownButton bsSize="small" title="Choose Dataset" id="diseasePairSelect">
              <MenuItem eventKey="1" 
                onClick={() => {this.updateVisualisation(dataAchondroplasia(), dataPseudoAchondroplasia())}}>
                Achondroplasia / Pseudoachondroplasia
              </MenuItem>
              <MenuItem eventKey="2"
                onClick={() => {this.updateVisualisation(dataAlkaptonuria(), dataPhenylketonuria())}}>
                Alkaptonuria / Phenylketonuria
              </MenuItem>
              <MenuItem eventKey="3"
                onClick={() => {this.updateVisualisation(dataTetraploidy(), dataTriploidy())}}>
                Tetraploidy / Triploidy
              </MenuItem>
            </DropdownButton>
          </ButtonToolbar>
        </Header>
        
        <Left>
          {this.state.radar.length > 0 &&
            <Radar 
              data={this.state.radar} 
              options={{
                w: 500,
                h: 500,
                wrapWidth: 100,
                labelFactor: 1.2
              }}
            />
          }
        </Left>
        
        <Right>
          <TableDiseaseMatch data={this.state.table} />
          <br /><br />
          {this.state.triptych.length > 0 ?
            <Triptych data={this.state.triptych}/> :
            <span>
              <SpinningLogo glyph="refresh" /> Loading Triptych Data...
            </span>
          }
        </Right> 
      </div>
    );
  }
}

