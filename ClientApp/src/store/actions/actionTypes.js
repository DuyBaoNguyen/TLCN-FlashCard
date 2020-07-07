// HOME
export const GET_DECKS_SUCCESS = 'GET_DECKS_SUCCESS';
export const GET_DECKS_FAILED = 'GET_DECKS_FAILED';
export const GET_STATISTICS_SUCCESS = 'GET_STATISTICS_SUCCESS';
export const GET_STATISTICS_FAIL = 'GET_STATISTICS_FAIL';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAIL = 'GET_PROFILE_FAIL';
export const FILTER_DECKS = 'FILTER_DECKS';
export const SET_DECKS_FILTERED_VALUE = 'SET_DECKS_FILTERED_VALUE';

// DECK
export const CREATE_DECK_SUCCESS = 'CREATE_DECK_SUCCESS';
export const CREATE_DECK_FAIL = 'CREATE_DECK_FAIL';
export const EDIT_DECK_SUCCESS = 'EDIT_DECK_SUCCESS';
export const EDIT_DECK_FAIL = 'EDIT_DECK_FAIL';

// Deck Detail
export const GET_DECK_SUCCESS = 'GET_DECK_SUCCESS';
export const GET_DECK_FAIL = 'GET_DECK_FAIL';
export const GET_DECK_STATISTICS_SUCCESS = 'GET_DECK_STATISTICS_SUCCESS';
export const GET_DECK_STATISTICS_FAIL = 'GET_DECK_STATISTICS_FAIL';
export const GET_DECK_CARDS_INSIDE_SUCCESS = 'GET_DECK_CARDS_INSIDE_SUCCESS';
export const GET_DECK_CARDS_INSIDE_FAIL = 'GET_DECK_CARDS_INSIDE_FAIL';
export const GET_DECK_CARDS_OUTSIDE_SUCCESS = 'GET_DECK_CARDS_OUTSIDE_SUCCESS';
export const GET_DECK_CARDS_OUTSIDE_FAIL = 'GET_DECK_CARDS_OUTSIDE_FAIL';
export const FILTER_CARDS_INSIDE = 'FILTER_CARDS_INSIDE';
export const SET_CARDS_INSIDE_FILTERED_VALUE = 'SET_CARDS_INSIDE_FILTERED_VALUE';
export const FILTER_CARDS_OUTSIDE = 'FILTER_CARDS_OUTSIDE';
export const SET_CARDS_OUTSIDE_FILTERED_VALUE = 'SET_CARDS_OUTSIDE_FILTERED_VALUE';
export const UPDATE_CARDS_INSIDE_SEARCH_STRING = 'UPDATE_CARDS_INSIDE_SEARCH_STRING';
export const UPDATE_CARDS_OUTSIDE_SEARCH_STRING = 'UPDATE_CARDS_OUTSIDE_SEARCH_STRING';
export const DELETE_DECK_SUCCESS = 'DELETE_DECK_SUCCESS';
export const DELETE_DECK_FAIL = 'DELETE_DECK_FAIL';
export const UPDATE_DECK_PUBLIC_STATUS_SUCCESS = 'UPDATE_DECK_PUBLIC_STATUS_SUCCESS';
export const UPDATE_DECK_PUBLIC_STATUS_FAIL = 'UPDATE_DECK_PUBLIC_STATUS_FAIL';
export const SELECT_CARD_IN_DECK_DETAILS = 'SELECT_CARD_IN_DECK_DETAILS';
export const UNSELECT_CARD_IN_DECK_DETAILS = 'UNSELECT_CARD_IN_DECK_DETAILS';
export const REMOVE_CARD_SUCCESS = 'REMOVE_CARD_SUCCESS';
export const REMOVE_CARD_FAIL = 'REMOVE_CARD_FAIL';
export const ADD_CARD_SUCCESS = 'ADD_CARD_SUCCESS';
export const ADD_CARD_FAIL = 'ADD_CARD_FAIL';
export const RESET_STATE_IN_DECK_DETAIL_REDUCER = 'RESET_STATE_IN_DECK_DETAIL_REDUCER';

// Testing
export const GET_CARDS_IN_DECK_SUCCESS = 'GET_CARDS_IN_DECK_SUCCESS';
export const GET_CARDS_IN_DECK_FAIL = 'GET_CARDS_IN_DECK_FAIL';
export const UPDATE_RANDOM_CARD = 'UPDATE_RANDOM_CARD';
export const UPDATE_CARDS_IN_DECK = 'UPDATE_CARDS_IN_DECK';
export const SEND_TEST_RESULT_SUCCESS = 'SEND_TEST_RESULT_SUCCESS';
export const SEND_TEST_RESULT_FAIL = 'SEND_TEST_RESULT_FAIL';
export const SEND_TEST_RESULT = 'SEND_TEST_RESULT';

// Match cards
export const GET_MATCH_CARDS_SUCCESS = 'GET_MATCH_CARDS_SUCCESS';
export const GET_MATCH_CARDS_FAIL = 'GET_MATCH_CARDS_FAIL';
export const GET_MATCH_CARDS = 'GET_MATCH_CARDS';
export const UPDATE_MATCH_CARDS = 'UPDATE_MATCH_CARDS';

// CardsManagement
export const GET_CARDS_SUCCESS = 'GET_CARDS_SUCCESS';
export const GET_CARDS_FAIL = 'GET_CARDS_FAIL';
export const UPDATE_CARDS_SEARCH_STRING = 'UPDATE_CARDS_SEARCH_STRING';
export const SELECT_CARD_IN_CARDS = 'SELECT_CARD_IN_CARDS';
export const RESET_STATE_IN_CARDS_REDUCER = 'RESET_STATE_IN_CARDS_REDUCER';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_FAIL = 'DELETE_CARD_FAIL';

// Card
export const CREATE_CARD_FAIL = 'CREATE_CARD_FAIL';
export const GET_CARD_SUCCESS = 'GET_CARD_SUCCESS';
export const GET_CARD_FAIL = 'GET_CARD_FAIL';
export const CLEAR_UPDATE_FRONT_ERROR = 'CLEAR_UPDATE_CARD_ERROR';
export const TOGGLE_CARD_FRONT_FORM = 'TOGGLE_CARD_FRONT_FORM';
export const TOGGLE_CARD_BACK_FORM = 'TOGGLE_CARD_BACK_FORM';
export const RESET_STATE_IN_CARD_REDUCER = 'RESET_STATE_IN_CARD_REDUCER';
export const UPDATE_FRONT_SUCCESS = 'UPDATE_FRONT_SUCCESS';
export const UPDATE_FRONT_FAIL = 'UPDATE_FRONT_FAIL';
export const UPDATE_BACK_SUCCESS = 'UPDATE_BACK_SUCCESS';
export const UPDATE_BACK_FAIL = 'UPDATE_BACK_FAIL';
export const CLEAR_UPDATE_BACK_ERROR = 'CLEAR_UPDATE_BACK_ERROR';
export const CREATE_BACK_SUCCESS = 'CREATE_BACK_SUCCESS';
export const CREATE_BACK_FAIL = 'CREATE_BACK_FAIL';
export const DELETE_BACK_SUCCESS = 'DELETE_BACK_SUCCESS';
export const DELETE_BACK_FAIL = 'DELETE_BACK_FAIL';
export const SELECT_BACK = 'SELECT_BACK';
export const UNSELECT_BACK = 'UNSELECT_BACK';
export const DELETE_IMAGE_SUCCESS = 'DELETE_IMAGE_SUCCESS';
export const DELETE_IMAGE_FAIL = 'DELETE_IMAGE_FAIL';
export const UPDATE_IMAGE_SUCCESS = 'UPDATE_IMAGE_SUCCESS';
export const UPDATE_IMAGE_FAIL = 'UPDATE_IMAGE_FAIL';
export const FILTER_CARDS = 'FILTER_CARDS';
export const SET_CARDS_FILTERED_VALUE = 'SET_CARDS_FILTERED_VALUE';

// Admin users management
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAIL = 'GET_USERS_FAIL';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS';
export const GET_CURRENT_USER_FAIL = 'GET_CURRENT_USER_FAIL';
export const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER';
export const GET_CURRENT_USER_DECKS_SUCCESS = 'GET_CURRENT_USER_DECKS_SUCCESS';
export const GET_CURRENT_USER_DECKS_FAIL = 'GET_CURRENT_USER_DECKS_FAIL';
