import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import './DeckDetail.css';
import Info from '../../modules/Info/Info';
import Testing from '../Testing/Testing';
import AddCards from '../AddCards/AddCards';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';

class DeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {},
			statisticsData: {},
			redirectTesting: false,
			redirectAddCards: false,
			redirectDashboard: false,
		};
	}

	componentWillMount() {
		var deckID = this.getDeckIDFromPath();
		console.log(deckID);
		this.setState({
			id: deckID
		});
	}

	componentDidMount() {
		this.getDeckData();
		this.getStatistics();
	}

	getDeckIDFromPath = () => {
		return this.props.match.params.deckId;
	};

	getDeckData = async () => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ deckData: data, loading: false });
	};

	getStatistics = async () => {
		var url = '/api/statistics/' + this.state.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ statisticsData: data, loading: false });
		console.log(data);
	};

	redirectTesting = () => {
		this.setState({
			redirectTesting: true
		});
	};

	redirectAddCards = () => {
		this.setState({
			redirectAddCards: true
		});
	};

	transData = () => {
		var mockData = [];
		var oldVocab = Object.create(null);
		var data = this.state.deckData.cards;
		if (data != undefined) {
			data.map((vocab, index) => {
				oldVocab = {
					id: vocab.id,
					front: vocab.front,
					backs: vocab.backs.map((back, index2) => {
						return back.meaning;
					})
				};
				mockData.push(oldVocab);
			});
			console.log(mockData);
			return mockData;
		}
	};

	deleteCard = async param => {
		var url = '/api/decks/' + this.state.id + '/cards';
		const token = await authService.getAccessToken();
		const data = '[' + param.toString() + ']';
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to delete this card?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'DELETE',
					body: data,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				const json = await response;
				console.log('Success:', JSON.stringify(json));
			} catch (error) {
				console.error('Error:', error);
			}
			// eslint-disable-next-line no-undef
			// eslint-disable-next-line no-restricted-globals
			location.reload();
		}
	};

	deleteDeck = async param => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to delete this deck?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				const json = await response;
				console.log('Success:', JSON.stringify(json));
			} catch (error) {
				console.error('Error:', error);
			}
			// eslint-disable-next-line no-undef
			// eslint-disable-next-line no-restricted-globals
			this.setState({
				redirectDashboard: true,
			});
		}
	};

	table = () => {
		var data = this.transData();
		var title = 'Card in deck: ' + this.state.deckData.name;
		return (
			<MaterialTable
				title={title}
				columns={[
					{ title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'backs' }
				]}
				data={data}
				actions={[
					{
						icon: 'edit',
						tooltip: 'Edit card',
						onClick: (event, rowData) => alert(typeof rowData.id)
					},
					{
						icon: 'delete',
						tooltip: 'Delete card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.deleteCard(rowData.id)
					},
					{
						icon: 'add',
						tooltip: 'Add Cards',
						isFreeAction: true,
						onClick: event => this.redirectAddCards()
					}
				]}
			/>
		);
	};

	render() {
		console.log(this.props.match.params.deckId);
		var date = new Date(this.state.deckData.createdDate);
		var testURL = '/testing/' + this.state.id.toString();
		var addCardsURL = '/addcards/' + this.state.id.toString();

		if (this.state.redirectTesting === true) {
			return <Redirect to={testURL} Component={Testing} />;
		}

		if (this.state.redirectAddCards === true) {
			return <Redirect to={addCardsURL} Component={AddCards} />;
		}

		if (this.state.redirectDashboard === true) {
			return <Redirect to='/' Component={Dashboard} />;
		}

		var table = this.table();
		return (
			<div>
				<div className="deck-fields">
					<div className="deck-back">
						<a href="/">Back</a>
					</div>
					<div className="deck-content">
						<div class="deck-content-info">
							<div class="deck-title">Info</div>
							<div class="deck-content-info-line">
								Deck name: {this.state.deckData.name}
							</div>
							<div class="deck-content-info-line">Number of cards:</div>
							<div class="deck-content-info-line">
								Date created: {date.toLocaleDateString()}
							</div>
						</div>
						<Info
							data={
								this.state.statisticsData != undefined
									? this.state.statisticsData
									: null
							}
						/>
						<div className="deck-content-advanced">
							<div class="deck-content-advanced-features">
								<div class="deck-title">Features</div>
							</div>
							<div class="deck-content-advanced-features-items">
								<p onClick={this.deleteDeck} style={{color: 'red'}}>Delete deck</p>
								<div class="deck-button" onClick={this.redirectTesting}>
									<p>Review</p>
								</div>
							</div>
							{/* <div class="deck-content-advanced-share">
								<div class="deck-title">Share deck</div>
								<div class="switch">
									<FormGroup row>
										<FormControlLabel
											control={<Switch value="checkedA" color="primary" />}
											label="Secondary"
										/>
									</FormGroup>
								</div>
							</div> */}
						</div>
					</div>
					<div className="table">{table}</div>
				</div>
			</div>
		);
	}
}

export default DeckDetail;
