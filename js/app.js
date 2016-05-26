angular.module( 'hacklab', ['ngMaterial', 'ngAnimate', 'ui.router'])
    .config(function($mdIconProvider){
        $mdIconProvider.fontSet('md', 'material-icons');
    })
    .config(function($mdThemingProvider){
        $mdThemingProvider.theme('default')
            .primaryPalette('red')
            .accentPalette('orange')
        ;
    })
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url : '/',
                templateUrl : 'partials/home.html'
            })
            .state('about', {
                url : '/about',
                templateUrl : 'partials/about.html'
            })
            .state('category', {
                url : '/category',
                templateUrl : 'partials/category.html'
            })
            .state('howto', {
                url : '/howto/:id',
                templateUrl : 'partials/howto.html',
                controller : function($stateParams, $mdToast){
                    var app = angular.element(document.getElementById('appCtrl')).scope().get();
                    var vm = this;
                    for(var i in app.howtos){
                        if(app.howtos[i].id == $stateParams.id){
                            vm.howto = app.howtos[i];
                            vm.steps = [];
                            for(var n in app.steps){
                                if(app.steps[n].howto_id == vm.howto.id){
                                    vm.steps.push(app.steps[n]);
                                }
                            }
                            vm.step = vm.steps[0];
                            vm.comments = findCommentsForStep(vm.step.id);
                        }
                    }

                    vm.nextStep = function(stepId){
                        if(vm.step.next == ''){
                            $mdToast.show({
                                template : "No more steps!",
                                hideDelay : 3000
                            })
                        }
                        else {
                            vm.step = findStepById(vm.step.next);
                            vm.comments = findCommentsForStep(vm.step.id);
                        }
                    }

                    vm.prevStep = function(stepId){
                        if(vm.step.prev == ''){
                            $mdToast.show({
                                template : "It's the first step!",
                                hideDelay : 3000
                            })
                        }
                        else {
                            vm.step = findStepById(vm.step.prev);
                            vm.comments = findCommentsForStep(vm.step.id);
                        }
                    }

                    function findStepById(stepId){
                        for(var i in app.steps){
                            if(app.steps[i].id == stepId){
                                return app.steps[i];
                            }
                        }
                    }

                    function findCommentsForStep(stepId){
                        var comments = [];
                        for(var i in app.comments){
                            if(app.comments[i].step_id == stepId){
                                comments.push(app.comments[i]);
                            }
                        }
                        return comments;
                    }

                    vm.addCommentToStep = function(comment, step){
                        comment.id = app.comments.length;

                        console.log(comment);

                        if(!comment.body){
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("You need content to your comment")
                                    .hideDelay(3000)
                            );
                        }
                        else {
                            var newComment = {id : comment.id, name : comment.name, body : comment.body, step_id : step.id};
                            app.comments.push(newComment);
                            vm.comments = findCommentsForStep(step.id);
                        }
                    }

                    return vm;
                },
                controllerAs : 'howto'
            })
            .state('post', {
                url : '/post',
                templateUrl: 'partials/post.html'
            })
        ;
    })
    .controller('AppCtrl', function($timeout, $mdSidenav, $mdBottomSheet, $scope){
        var app = this;

        app.categories = [
            { id : 1, name : 'woodworking', description : 'A really rewarding hobby with wood', picture : 'woodworking.jpg'},
            { id : 2, name : 'knitting', description : 'A really rewarding hobby with wool', picture : 'knitting.jpg'},
            { id : 3, name : 'electronics', description : 'A really rewarding hobby with PCB', picture : 'electronics.jpg'},
            { id : 4, name : 'pottery', description : 'A really rewarding hobby with clay', picture : 'pottery.jpg'},
            { id : 5, name : 'drawing', description : 'A really rewarding hobby with pencils', picture : 'drawing.jpg'}
        ];

        app.howtos = [
            {id : 1, name : 'Simple bench',description : 'Something easy to do!', difficulty : 3, picture : 'bench.jpg', category_id : 1},
            {id : 2, name : 'Simple table',description : 'Something easy to do!', difficulty : 4, picture : 'table.jpg', category_id : 1},
            {id : 3, name : 'Simple headrest',description : 'Something easy to do!', difficulty : 2, picture : 'headrest.jpg', category_id : 2},
            {id : 4, name : 'arcade cabinet',description : 'Something easy to do!', difficulty : 5, picture : 'arcade.jpg', category_id : 3},
        ];

        app.steps = [
            {id : 1, n : 1, name : 'Start your project', description : "You'll need a basic set of tools and some wood", prev : '', next : 2, picture : '1-1.jpg', howto_id : 1},
            {id : 2, n : 2, name : 'Cut the pieces', description : "Take your time, follow the plans and cut the needed pieces", prev : 1, next : 3, picture : '1-2.jpg', howto_id : 1},
            {id : 3, n : 3, name : 'Assembly and finish', description : "Take the pieces together following the plan, and GO! Use a coat of oil to finish", prev : 2, next : '', picture : '1-3.jpg', howto_id : 1},
            {id : 4, n : 1, name : 'Go to Ikea', description : "Get a table", prev : '', next : '', picture : '2-1.jpg', howto_id : 2},
            {id : 5, n : 1, name : 'Find a stool', description : "You got stool", prev : '', next : '', picture : '3-1.jpg', howto_id : 3},
            {id : 6, n : 1, name : 'Buy a Razer Arcade Cabinet for a effing load of money', description : "Enjoy 90's gaming experience on hardware worth more than your house", prev : '', next : '', picture : '4-1.jpg', howto_id : 4},
        ];

        app.comments = [
            {id : 1, name : 'Lucien', body : 'Even you can do it', step_id : 1},
            {id : 2, name : 'Jeanne', body : 'Where can I get wood ?', step_id : 1},
            {id : 3, name : 'Fabienne', body : 'google : how to use a screwdriver', step_id : 2},
            {id : 4, name : 'Jean-Marc', body : 'How to use a screwdriver ?', step_id : 2},
            {id : 5, name : 'Patrick', body : 'I hate benches', step_id : 3},
            {id : 6, name : 'NumaNuma', body : 'I failed at step 4', step_id : 3},
        ];

        app.newHowto = [
            [
                {title : 'Start your project', description : 'Gather the needed materials and find a clean surface'}
            ]
        ];

        app.addNewStep = function(step){
            var newStep = {title : step.title, description : step.description};

            for(var n in app.newHowto){
                if(app.newHowto[n].length < 4){
                    app.newHowto[n].push(newStep);
                    step = {};
                }
                else {
                    app.newHowto.push([newStep]);
                    step = {};
                }
            }
        }

        app.toggleLeft = function(){
            $mdSidenav('left').toggle();
        }

        app.openBottomSheet = function(cat_id){
            $mdBottomSheet.show({
                templateUrl : 'partials/category.show.html',
                controller : function($scope){
                    var howtos = [];
                    for(var i in app.howtos){
                        howto = app.howtos[i];
                        if(howto.category_id == cat_id){
                            howtos.push(howto);
                        }
                    }
                    $scope.cat_howtos = howtos;
                }
            })
        }

        $scope.get = function(){
            return app;
        }

        app.getRandomSpan = function(){
            return Math.floor(Math.random()*3);
        }

        return app;
    })
    .directive('animate-on-change', function(){
        console.log('lol');
    })
    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
;