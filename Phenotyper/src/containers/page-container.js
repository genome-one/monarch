import { connect } from 'react-redux';
import PageContainer from '../components/page-component/page-container.js';


export const mapStateToProps = (state) => {
  return {
    patients: state.patients,
    paragraphs: state.paragraphs,
    hpo: state.hpo
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}
const VisiblePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageContainer)

export default VisiblePageContainer;