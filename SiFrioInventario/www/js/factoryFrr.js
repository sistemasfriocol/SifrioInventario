angular.module('starter.services', [])


.factory('Cadena', function () {
    var parametros = {
        Cadena: 'http://www.serviciosfriocol.sicolombia.info/',
        Empleado: -1,
        NombreEmpleado: '',
        IdCliente: 0,
        habilitarMenu: false,
            };
    //var Cadena =http://localhost:50141/
    //var Cadena = 'http://www.serviciosfriocol.sicolombia.info/';

    return {
        getCadena: function () {
            return parametros;
        },
        setEmpleado(IdEmpleado, NombreEmpleado) {
            parametros.Empleado = IdEmpleado;
            parametros.NombreEmpleado = NombreEmpleado;
        },
        setCliente(Cliente) {
            parametros.IdCliente = Cliente;
        },
        setHabilitarMenu() {
            parametros.habilitarMenu = true;
        }

    };
});