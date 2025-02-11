import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as LocationIcon } from '../assets/LocationIcon.svg';
import Card from '@material-ui/core/Card';


function getFullNameFromSpot(spot) {
  return spot.name.trim().toLowerCase() + " " + spot.area.trim().toLowerCase() + " " + spot.country.trim().toLowerCase();
}

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      variant="outlined"
      className={classes.input}
      margin="dense"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon component={LocationIcon} />
          </InputAdornment>
        ),
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
      InputLabelProps={{
        shrink: true
      }}
      error={inputProps.error}
      helperText={inputProps.errorMessage}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const fullName = suggestion.name + "    -    " + suggestion.area + ", " + suggestion.country
  const matches = match(fullName, query);
  const parts = parse(fullName, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300, fontSize: 14 }}>
              {part.text}
            </span>
          ) : (
              <strong key={String(index)} style={{ fontWeight: 500, fontSize: 14 }}>
                {part.text}
              </strong>
            );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function getSuggestions(value, spots) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : spots.filter(spot => {

      const fullName = getFullNameFromSpot(spot);

      const keep =
        count < 5 && fullName.indexOf(inputValue) > -1;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 5,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  input: {
    background: "#F4F7F9",
    color: "#000000"
  }
});

class IntegrationAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: []
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.spots),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.handler(suggestion);
  };

  render() {
    const { classes } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          placeholder: 'Huntington Beach, CA',
          value: this.state.value,
          onChange: this.handleChange,
          error: this.props.error,
          errorMessage: this.props.errorMessage
        }}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);
