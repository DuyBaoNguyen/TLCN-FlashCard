import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import downloadIcon from '@iconify/icons-uil/arrow-to-bottom';
import pinIcon from '@iconify/icons-mdi/pin-outline';
import unpinIcon from '@iconify/icons-mdi/pin-off-outline';
import createdDateIcon from '@iconify/icons-uil/calendar-alt';
import ownerIcon from '@iconify/icons-uil/user';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import Button from '../../Shared/Button/Button';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import './PublicDeckInfo.css';

class PublicDeckInfo extends Component {
  state = {
    downloadingConfirmOpen: false
  };

  handleOpenDownloadingConfirm = () => {
    this.setState({ downloadingConfirmOpen: true });
  }

  handleCloseDownloadingConfirm = () => {
    this.setState({ downloadingConfirmOpen: false });
  }

  handleDownloadDeck = () => {
    this.props.onDownloadPublicDeck(this.props.match.params.deckId);
    this.handleCloseDownloadingConfirm();
  }

  handlePinPublicDeck = () => {
    this.props.onPinPublicDeck(this.props.match.params.deckId);
  }

  handleUnpinPublicDeck = () => {
    this.props.onUnpinPublicDeck(this.props.match.params.deckId);
  }
  
  handleClickPractice = () => {
    this.props.onSetPracticeOptionsOpen(true);
  }

  render() {
    const { deck, showLess, location } = this.props;
    const { downloadingConfirmOpen } = this.state;
    const downloadable = location.pathname.search(/^\/publicdecks\/\d+$/) > -1;

    return (
      <div className="public-deck-info-wrapper">
        <div className="public-deck-info-header">
          {deck?.name}
        </div>
        <Collapse
          isOpened={!showLess}
          theme={{
            collapse: 'ReactCollapse--collapse deck-info',
            content: 'ReactCollapse--content content'
          }}>
          {deck?.description && (
            <div className="deck-description" title={deck.description}>
              {deck.description}
            </div>
          )}
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={cardIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Number of cards
            </span>
            <span className="deck-field-value">{deck?.totalCards}</span>
          </div>
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={createdDateIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Created date
            </span>
            <span className="deck-field-value">
              {deck?.createdDate && new Date(deck.createdDate).toDateString()}
            </span>
          </div>
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={ownerIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Owner
            </span>
            <span className="deck-field-value">
              {deck?.owner.name}
              <span className="deck-field-extra-value">{deck?.owner.email}</span>
            </span>
          </div>
        </Collapse>
        {!showLess && (
          <>
            <div className="deck-features first-child">
              {deck?.pinned
                ? (
                  <Button
                    type="button"
                    className="unpin-btn left-btn"
                    icon={<Icon icon={unpinIcon} />}
                    onClick={this.handleUnpinPublicDeck}>
                    Unpin
                  </Button>
                )
                : (
                  <Button
                    type="button"
                    className="pin-btn left-btn"
                    icon={<Icon icon={pinIcon} />}
                    onClick={this.handlePinPublicDeck}>
                    Pin
                  </Button>
                )
              }
              {downloadable && (
                <>
                  {deck?.localDeckId
                    ? (
                      <Button
                        type="link"
                        className="open-btn right-btn"
                        path={{ pathname: `/decks/${deck.localDeckId}`, state: { backUrl: location.pathname } }}>
                        Open
                      </Button>
                    )
                    : (
                      <Button
                        className="download-btn right-btn"
                        icon={<Icon icon={downloadIcon} />}
                        onClick={this.handleOpenDownloadingConfirm} >
                        Download
                      </Button>
                    )
                  }
                </>
              )}
            </div>
          </>
        )}
        <div className="deck-features">
          <Button
            type="button"
            className="left-btn"
            onClick={this.handleClickPractice}>
            Practice
          </Button>
          <Button
            type="link"
            className="right-btn"
            path={`/decks/match/${deck?.id}`}>
            Match game
          </Button>
        </div>
        <Confirm
          isOpen={downloadingConfirmOpen}
          header="Download"
          message="Do you want to download this deck?"
          confirmColor="#5ad95a"
          onCancel={this.handleCloseDownloadingConfirm}
          onConfirm={this.handleDownloadDeck}>
        </Confirm>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDownloadPublicDeck: (deckId) => dispatch(actions.downloadAdminPublicDeck(deckId)),
    onPinPublicDeck: (deckId) => dispatch(actions.pinPublicDeck(deckId)),
    onUnpinPublicDeck: (deckId) => dispatch(actions.unpinPublicDeck(deckId)),
    onSetPracticeOptionsOpen: (value) => dispatch(actions.setPracticeOptionsOpen(value))
  };
};

export default withRouter(connect(null, mapDispatchToProps)(PublicDeckInfo));