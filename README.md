# TFG

Desarrollo de videojuegos DeFi y su sostenibilidad económica

## INSTALACIÓN

Se necesita tener instalado:

- Git.
- NodeJS 14.15.3 o superior
- NPM 6.14.9 o superior
- Truffle v5.3.7
- Web3.js v1.3.6
- Ganache (versión aplicación de escritorio preferiblemente)

En primer lugar, descargamos o clonamos el proyecto en nuestra máquina, lo podemos hacer con el siguiente comando:

    git clone https://github.com/SergioCltn/CryptoChickens.git

Ahora, nos cambiamos al nuevo directorio CryptoChickens con:

    cd CryptoChickens

Instalamos o actualizamos todos los paquetes necesarios:

Directorio Raíz:

    npm install

Directorio /client

    cd client
    npm install

Una vez instaladas todas las dependencias, desde el directorio raíz haciendo uso de truffle compilaremos nuestro contrato:

    truffle compile

Este comando crea una nueva carpeta dentro del directorio src con el contrato compilado a JSON.

A continuación es necsario poner en marcha Ganache. Para ello, desde la interfaz gráfica podemos crear un workspace o darle a 'quickstart'.

En caso de crear un workspace personal, es necesario modificar tambien el fichero truffle-config.js para que haga uso de la configuración que usamos.

Con Ganache funcionando, procedemos a desplegar el contrato en la cadena de bloques:

    truffle migrate

En ejecuciones posteriores haremos uso de la opción `--reset` poder relanzar el contrato en la cadena de bloques como nuevo.

Finalmente, accediendo al directorio /client lanzamos la aplicación

    cd client
    npm start

Se nos abrirá una ventana o pestaña de nuestro navegador con la aplicación alojada en http://localhost:3000/

Una vez abierta la aplicación debemos importar alguna cuenta de las creadas por Ganache haciendo uso de MetaMask.
Es necesario configurar MetaMask añadiendo una nueva red RPC que apunte a http://127.0.0.1 con el chainID 5777

Una vez tenemos alguna cuenta importada se podrán probar algunas funcionalidades, pero será necesario de al menos
dos cuentas para poder simular todos los comportamientos desarrollados.

## TESTING

Para poder ejecutar los test desarrollados en la aplicación necesitamos tener el entorno de Ganache activado,
y haciendo ejecutamos el comando:

    truffle test

Y por defecto hará uso de la red de desarollo para hacer los tests.
