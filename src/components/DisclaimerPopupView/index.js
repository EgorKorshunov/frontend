import styles from './styles.module.scss';
import { connect } from 'react-redux';
import Button from '../Button';
import { PopupActions } from '../../store/actions/popup';
import CheckBox from '../CheckBox';
import { useState } from 'react';
import classNames from 'classnames';

const DisclaimerPopupView = ({ closed, hidePopup }) => {
  const [agreedWithTerms, setAgreedWithTerms] = useState(false);

  const handleClickButton = () => {
    localStorage.setItem('acceptedTerms', 'true');
    hidePopup();
  };

  const renderDisclaimerText = () => {
    return (
      <div className={styles.disclaimerPopupTextContainer}>
        <h3 className={styles.disclaimerPopupTextHeadline}>
          Please read and agree to the disclaimer
        </h3>

        {/* <span className={styles.disclaimerPopupText}>
        </span> */}

        <div className={styles.disclaimerPopupScrollableContainer}>
          <div className={styles.disclaimerPopupScrollableText}>
            <p>
              Wallfair Alpha is a graphical user interface for visualizing and
              interacting with data stored in a decentralized blockchain
              network.
            </p>
            <p>
              The platform serves informational, entertainment and educational
              purposes only. Please read the full disclaimer below before
              proceeding.
            </p>
            <ol>
              <li>
                Wallfair Ltd. is a company organized in accordance with the laws
                of Bailwick of Guernsey (Alderney), registration number 2024,
                located at 2 Victoria Street, St. Anne, GY9 3UF, Alderney
                Channel Islands. Wallfair Ltd. has pending applications for
                gambling licenses with the Alderney Gambling Control Commission
                and the Curacao Gaming Authority. Curacao Gaming licensing and
                supervision is controlled by the Government of Curacao under
                National Decree No. 14 from 18. August 1998 while the applicable
                law on Alderney is the Gambling Law of 1999.
              </li>
              <li>
                Wallfair.io is a blockchain-based platform built on Polygon
                chain and incorporating the usability function of an ERC-20
                token (“WFAIR”) minted in Alderney and distributed through
                decentralized exchanges as well as the Trustpad launchpad
                (www.trustpad.io).
              </li>
              <li>
                The platform serves informational, entertainment and educational
                purposes only.
              </li>
              <li>
                The users need to be of age (18+) and sound body and mind
                (meaning unaffected by addiction or substances causing loss of
                control or consciousness) to use the website.
              </li>
              <li>
                All bets, events and trades on the website are final and the
                availability of the platform may be affected by the online
                connection enabled by your local internet provider.
              </li>
              <li>
                The dispute resolution as well as other functions on the site
                are developed by the Wallfair core team and established in
                accordance with the internal guidelines found on the website.
              </li>
              <li>
                All further questions and doubts can be addressed to the team at{' '}
                <a href="mailto:hello@wallfair.io">hello@wallfair.io</a> as well
                as on the social media channels, e.g. Telegram and Twitter.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  const renderCheckbox = () => {
    return (
      <CheckBox
        className={styles.authenticationLegalAuthorizationAgreementCheckBox}
        checked={agreedWithTerms}
        setChecked={setAgreedWithTerms}
        clickable={true}
        text={<span>I have read and agreed to the above conditions</span>}
      />
    );
  };

  const renderCTAButton = () => {
    return (
      <Button
        onClick={handleClickButton}
        className={classNames(
          styles.ctaButton,
          !agreedWithTerms ? styles.disabledCTA : null
        )}
        disabled={!agreedWithTerms}
        disabledWithOverlay={false}
      >
        <span>Proceed</span>
      </Button>
    );
  };

  return (
    <div className={styles.disclaimerPopupContainer}>
      {renderDisclaimerText()}
      {renderCheckbox()}
      {renderCTAButton()}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
  };
};

export default connect(null, mapDispatchToProps)(DisclaimerPopupView);
