CREATE DATABASE pronet
GO

USE pronet
GO
CREATE TABLE TIPO_CAMBIO(
	ID INT PRIMARY KEY IDENTITY,
	FECHA_INICIAL DATE,
	FECHA_FINAL DATE,
	PROMEDIO_VENTA FLOAT,
	PROMEDIO_COMPRA FLOAT
)
GO

CREATE PROCEDURE SP_CREAR_TIPO_CAMBIO
	@FECHA_FINAL Date,
	@FECHA_INICIAL Date,
	@PROMEDIO_COMPRA Float,
	@PROMEDIO_VENTA Float
AS	
	INSERT INTO TIPO_CAMBIO(FECHA_FINAL,FECHA_INICIAL,PROMEDIO_COMPRA,PROMEDIO_VENTA)
	VALUES(@FECHA_FINAL, @FECHA_INICIAL, @PROMEDIO_COMPRA, @PROMEDIO_VENTA);
GO


CREATE PROCEDURE SP_OBTENER_TIPOS_CAMBIO
AS
	SELECT TIPO_CAMBIO.ID, CONVERT( varchar,TIPO_CAMBIO.FECHA_INICIAL, 3) AS FECHA_INICIAL , CONVERT(varchar,TIPO_CAMBIO.FECHA_FINAL,3) AS FECHA_FINAL, TIPO_CAMBIO.PROMEDIO_COMPRA, TIPO_CAMBIO.PROMEDIO_VENTA FROM TIPO_CAMBIO


	