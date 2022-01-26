import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  birthdayPlaceholder: { id: 'edit_profile.fields.birthday_placeholder', defaultMessage: 'Your birth date' },
});

const mapStateToProps = state => {
  const features = getFeatures(state.get('instance'));

  return {
    supportsBirthdays: features.birthdays,
    minAge: state.getIn(['instance', 'pleroma', 'metadata', 'birthday_min_age']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class EditProfile extends ImmutablePureComponent {

  static propTypes = {
    hint: PropTypes.node,
    required: PropTypes.bool,
    supportsBirthdays: PropTypes.bool,
    minAge: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.instanceOf(Date),
  };

  render() {
    const { intl, value, onChange, supportsBirthdays, hint, required, minAge } = this.props;

    if (!supportsBirthdays) return null;

    let maxDate = new Date();
    maxDate = new Date(maxDate.getTime() - minAge * 1000 * 60 * 60 * 24 + maxDate.getTimezoneOffset() * 1000 * 60);

    return (
      <div className='datepicker'>
        {hint && (
          <div className='datepicker__hint'>
            {hint}
          </div>
        )}
        <div className='datepicker__input'>
          <DatePicker
            selected={value}
            dateFormat='d MMMM yyyy'
            wrapperClassName='react-datepicker-wrapper'
            onChange={onChange}
            placeholderText={intl.formatMessage(messages.birthdayPlaceholder)}
            minDate={new Date('1900-01-01')}
            maxDate={maxDate}
            required={required}
          />
        </div>
      </div>
    );
  }

}