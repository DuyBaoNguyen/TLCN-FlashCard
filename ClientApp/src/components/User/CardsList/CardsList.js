import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Card from '../Card/Card';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './CardsList.css';

const AMOUNT_CARDS = 12;

class CardsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      setLoading: false
    };
  }

  componentDidMount() {
    this.props.onGetCards();

    if (!this.state.setLoading && !this.timeoutNumber) {
      setTimeout(() => {
        if (this.props.loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  handleClickCard = (cardId) => {
    this.props.onSelectCard(cardId);
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleSearchCards = (event) => {
    const searchString = event.target.value;
    this.props.onUpdateSearchString(searchString);
    this.props.onGetCards(searchString);
    this.setState({ activePage: 1 });
  }

  handleDeleteCard = (cardId) => {
    this.props.onDeleteCard(cardId);
  }

  render() {
    const { cards, loading } = this.props;
    let { activePage, setLoading } = this.state;
    let cardsList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0 && !loading) {
      cardsList = (
        <div className="cards">
          {cards.filter((card, index) => index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1)
            .map(card => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  options={[
                    {
                      type: 'link',
                      path: { pathname: `/cards/${card.id}/edit`, state: { backUrl: '/cards' }},
                      icon: <Icon icon={editIcon} color="#535353" />,
                      label: { value: 'Edit card' }
                    },
                    {
                      type: 'button',
                      icon: <Icon icon={deleteIcon} color="red" />,
                      label: { value: 'Delete card', color: 'red' },
                      onClick: () => this.handleDeleteCard(card.id)
                    }
                  ]}
                  onClick={this.handleClickCard} />
              );
            })}
        </div>
      );

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={activePage}
          itemsCountPerPage={AMOUNT_CARDS}
          totalItemsCount={cards.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="cards-list-wrapper">
        <div className="cards-list-header">
          <p>My cards</p>
          <div className="cards-list-header-features">
            <Button
              type="link"
              path={{ pathname: `/cards/create`, state: { backUrl: '/cards'}}}
              className="cards-list-header-features-add"
              icon={<Icon icon={plusIcon} />} >
            </Button>
            <Search
              placeholder="Search..."
              onChange={this.handleSearchCards} />
          </div>
        </div>
        {cardsList}
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards.cards,
    loading: state.cards.loadings.getCardsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCards: (front) => dispatch(actions.getCards(front)),
    onSelectCard: (id) => dispatch(actions.selectCardInCards(id)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsSearchString(value)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardsList);