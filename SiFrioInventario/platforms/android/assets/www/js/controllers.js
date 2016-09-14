angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, Cadena) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    $scope.MensajeErrorLogin = false;

    $scope.MostrarLogin = true;
    $scope.MostrarErrorLogin = false;
    $scope.MostrarBienvenida = false;


    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.VolverAMostrarLogin = function () {

        $scope.MostrarLogin = true;
        $scope.MostrarErrorLogin = false;
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        var usu = $scope.loginData.username;
        var contra = $scope.loginData.password;

        //var usu = this.usuario;
        //var contra = this.contra;


        var ref = new Firebase("https://inventariosifrio.firebaseio.com");
        ref.authWithPassword({
            email: usu,
            password: contra
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);

                $timeout(function () {

                    $scope.MostrarLogin = false;
                    $scope.MostrarErrorLogin = true;
                    $scope.MostrarBienvenida = false;
                }, 500);
            } else {
                console.log("Authenticated successfully with payload:", authData);

                $scope.loginData = authData;
                $timeout(function () {
                    Cadena.getCadena().setHabilitarMenu();
                    $scope.MostrarLogin = false;
                    $scope.MostrarBienvenida = true;
                }, 500);
            }
        });

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        //$timeout(function() {
        //  $scope.closeLogin();
        //}, 1000);
    };
})

.controller('PlaylistsCtrl', function ($scope) {

    $scope.clickLogin = function () {
        var ref = new Firebase("https://inventariosifrio.firebaseIO.com");
        ref.authWithPassword({
            email: "freddrenteria@hotmail.com",
            password: "2006947"
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);

                $timeout(function () {
                    alert(error)
                }, 500);
            } else {
                console.log("Authenticated successfully with payload:", authData);

                $scope.loginData = authData;
                $timeout(function () {
                    alert("bien");
                }, 500);
            }
        });

        $scope.go = function (path) {
            $location.path(path);
        };

    };

    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
})
.controller('InventarioCtrl', function ($scope, Cadena, $http, $timeout, $ionicPopup) {

    $scope.ListaBodegas = CargarBodegas();
    $scope.Cod = "";
    $scope.MostarDatos = false;
    $scope.BodegaSeleccionada = -1;
    $scope.Estante = "";
    $scope.MostrarError = false;
    $scope.ProductosBuscaInventario = "";
    $scope.Error = "";
    $scope.ColorBorde = "";

    $scope.AlertaTitulo = "Error al buscar el Producto";
    $scope.AlertaMensaje = "Mensaje de Error";

    $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: $scope.AlertaTitulo,
            template: $scope.AlertaMensaje
        });

        alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };


    function CargarBodegas() {
        var direccion = Cadena.getCadena().Cadena + 'api/Bodegas';

        $http({
            method: 'GET',
            url: direccion
        }).then(function successCallback(response) {
            $scope.ListaBodegas = response.data;
        }, function errorCallback(response) {
            //alert("Error");
            $scope.AlertaTitulo = "Error al Buscar la Bodega";
            $scope.AlertaMensaje = "Mo se Pudieron cargar las Bodegas";

            $scope.showAlert();
        });

        return '';
    };

    $scope.ClicBuscarProducto = function () {
        $scope.MostarDatos = true;

        var idBod = this.BodegaSeleccionada
        var codProd = this.Cod;
        idBod
        $scope.ColorBorde = "";

        var direccion = Cadena.getCadena().Cadena + 'api/ProductosBuscarInventario?CodProd=' + codProd + '&IdBodega=' + idBod;

        $http({
            method: 'GET',
            url: direccion,


        }).then(function successCallback(response) {
            $scope.MostrarError = false;

            $scope.ProductosBuscaInventario = response.data[0];
        }, function errorCallback(response) {
            $scope.MostrarError = true;
            $scope.Error = "Error al Buscar el Producto";

            $timeout(function () {
                $scope.MostrarError = false;
            }, 1000);
        });

        return '';

    };
    $scope.CliGuardarConteo = function () {

        var Cantidad = this.Cantidad;
        var Usuario = Cadena.getCadena().Empleado;
        var ProEst = this.ProductosBuscaInventario;

        var direccion = Cadena.getCadena().Cadena + 'api/ProductosBuscarInventario?cantidad=' + Cantidad + '&Usuario=' + Usuario;

        $http({
            method: 'PUT',
            url: direccion,
            data: ProEst
        }).then(function successCallback(response) {
            //getAllClientes();

            if (response.data == true) {

                $scope.MostarDatos = false;

                $scope.MostrarError = true;
                $scope.Error = "Datos Guardados Correctamente";

                $timeout(function () {
                    $scope.MostrarError = false;
                }, 1000);
            } else {
                $scope.ColorBorde = "BordeRojo";

                $scope.MostrarError = true;
                $scope.Error = "Cantidades No Valida";

                $timeout(function () {
                    $scope.MostrarError = false;
                }, 1000);
            }

        }, function errorCallback(response) {
            $scope.MostrarError = true;
            $scope.Error = "Error al Guardar";

            $timeout(function () {
                $scope.MostrarError = false;
            }, 1000);

        });
    }
})
.controller('PlaylistCtrl', function ($scope, $stateParams) {
});
