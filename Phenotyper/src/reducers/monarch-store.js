import { combineReducers } from 'redux';
import patients from './patients';
import paragraphs from './paragraphs';
import hpo from './hpo';

const MonarchApp = combineReducers({
  patients,
  paragraphs,
  hpo
})

export default MonarchApp;