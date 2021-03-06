/// <reference path="matches/IMatch.ts" />
/// <reference path="matches/IResult.ts" />
/// <reference path="matches/INewMatch.ts" />

interface IMatchListScope extends ng.IScope {
	matches: matches.IMatch[];
}

interface IMatchCreateScope extends ng.IScope, matches.INewMatch {
	players: players.IPlayer[];
	dateDate: Date;
	dateTime: Date;
	submit: Function;
}

module matches {

	export function MatchListCtrl($scope: IMatchListScope, $http: ng.IHttpService) {
		$http.get('api/matches').success(function(data: IMatch[]) {
			$scope.matches = data.map(function(match) {
				var date = moment(match.date);
				match.date = date.calendar();
				return match;
			});
		});
	}

	export function MatchCreateCtrl($scope: IMatchCreateScope, $http: ng.IHttpService, $location: ng.ILocationService) {

		$scope.dateDate = new Date();
		$scope.dateDate.setHours(0);
		$scope.dateDate.setMinutes(0);
		$scope.dateDate.setSeconds(0);
		$scope.dateDate.setMilliseconds(0);
		$scope.dateTime = new Date();

		$scope.submit = function() {
			if (!$scope.winner || !$scope.loser || !$scope.result) {
				return alert('Debes rellenar todo');
			}

			var timestamp = $scope.dateDate.getTime() + ($scope.dateTime.getHours() * 3600000 + $scope.dateTime.getMinutes() * 60000);

			var data:matches.INewMatch = {
				date: (new Date(timestamp)).toISOString(),
			 	winner: $scope.winner,
			 	loser: $scope.loser,
			 	result: $scope.result
			};

			$http.post('api/matches', data).success(function() {
				$location.path('matches');

			});
		};

		$http.get('api/players').success(function(data: players.IPlayer[]) {
			$scope.players = data;
		});
	}
}
