import React from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

export default class DateRange extends React.Component {
  handleSelect(ranges){
  }
  render(){
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
    return (
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={this.handleSelect}
      />
    )
  }
}