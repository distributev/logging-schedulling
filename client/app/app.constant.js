(function(angular, undefined) {
  angular.module("angularFullstackApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
})

;
})(angular);