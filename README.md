# TFG: ReparTe la plataforma para la gestión de gastos grupales

## Descripción General

Esta aplicación ha sido desarrollada como parte del Trabajo de Fin de Grado (TFG). Su objetivo principal es proporcionar una herramienta eficiente y colaborativa para gestionar los gastos compartidos en grupos, permitiendo a los usuarios registrar gastos, calcular balances y facilitar liquidaciones óptimas entre los miembros.

La aplicación consta de un **frontend** desarrollado con **React.js** y un **backend** construido con **Node.js** y **Express**, conectado a una base de datos **MySQL**. La comunicación entre el frontend y el backend se realiza mediante una API RESTful.

---

## Características Principales

### Funcionalidades
- **Gestión de Usuarios**: Registro, inicio de sesión y autenticación.
- **Creación y Gestión de Grupos**: Permite crear grupos, invitar miembros y gestionar la lista de participantes.
- **Registro de Gastos**: Los usuarios pueden registrar gastos compartidos con división equitativa o personalizada.
- **Cálculo de Balances**: Muestra quién debe a quién y cuánto, calculando automáticamente las deudas.
- **Liquidaciones Sugeridas**: Optimiza las transacciones necesarias para equilibrar los saldos del grupo.
- **Reembolsos**: Registro de pagos realizados dentro del grupo para mantener los balances.

### Tecnología Utilizada
- **Frontend**: React.js, TypeScript, TailwindCSS.
- **Backend**: Node.js, Express.js, TypeScript, Nodemailer.
- **Base de Datos**: MySQL (configurable localmente o con Docker).

---
