<?php

class data_access {

    public $connection;

	private $user= "root";
	private $password= ""; 
	private $host= "localhost";
	private	$bd = "bolo_creator";
	
	private $resultado;

    function __construct() {
        $this->conectar();
    }

    function conectar() {
	
        $connection = new mysqli($this->host,$this->user,$this->password, $this->bd);
				
 } 
     

	

    function execute_query($sql) {
         $connection = new mysqli($this->host,$this->user,$this->password, $this->bd);
				
		$this->resultado = $connection->query($sql);
				
		//print_r($this->resultado);
        return $this->resultado;
    }
	

	function extract_record()
	{
		if ($fila = mysqli_fetch_array($this->resultado,MYSQL_ASSOC))
		{
			return $fila;
		} 
		else 
		{
			return false;
		}
	}

    function return_results($sql) {
        $this->execute_query($sql);
        $output = array();

        while ($record = extract_record()) {
            $output[] = $record;
        }

        return $output;
    }	

    function quantity_records($sql) {
        $r = $this->execute_query($sql);

        $cantidad = mysqli_num_rows($r);
        return $cantidad;
    }

    /**
    * Método que permite insertar en la base de datos
    * y retornar el id con que se insertó
    */
    function insert_records($sql) {
        $r = $this->execute_query($sql);

        $new_id = mysqli_insert_id($this->connection);

        return $new_id;
    }
	    
}

?>
