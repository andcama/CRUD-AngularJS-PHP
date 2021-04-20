var app = angular.module('crudApp', ['datatables']);
app.controller('crudController', function($scope, $http){

	$scope.success = false;
	$scope.error = false;

	$scope.fetchData = function(){		
		$http({
			method:'GET',
			url: 'http://127.0.0.1:80/crud/api/read.php'
		})
		.then(function success(res){
			
			$scope.empleadosData = res.data.body;
		})
	};

	$scope.openModal = function(){
		var modal_popup = angular.element('#crudmodal');
		modal_popup.modal('show');
	};

	$scope.closeModal = function(){
		var modal_popup = angular.element('#crudmodal');
		modal_popup.modal('hide');
	};

	$scope.addData = function(){
		$scope.modalTitle = 'Add Data';
		$scope.submit_button = 'Insert';
		$scope.openModal();
	};

	$scope.submitForm = function(){
		if ($scope.submit_button == "Insert") {
			$http({
				method:'POST',
				 url:"http://127.0.0.1:80/crud/api/create.php",
				data:{'nombre':$scope.nombre, 'correo':$scope.correo,'edad':$scope.edad, 'puesto':$scope.puesto}
			}).success(function(data){
				if(data.error != '')
				{
					$scope.success = false;
					$scope.error = true;
					$scope.errorMessage = data.error;
				}
				else
				{
					$scope.success = true;
					$scope.error = false;
					$scope.successMessage = 'Data Inserted';
					$scope.form_data = {};
					$scope.closeModal();
					$scope.fetchData();
				}
			});
		} else {
			if ($scope.submit_button == "Edit") {
				
				$http({
					method:'POST',
					 url:"http://127.0.0.1:80/crud/api/update.php",
					data:{'nombre':$scope.nombre, 'correo':$scope.correo,'edad':$scope.edad, 'puesto':$scope.puesto, 'id' : $scope.hidden_id}
				}).success(function(data){
					{
						$scope.success = true;
						$scope.error = false;
						$scope.successMessage = 'Data Updated';
						$scope.form_data = {};
						$scope.closeModal();
						$scope.fetchData();
					}
				});
			}
			
		}
	
	};

	$scope.fetchSingleData = function(id){
		$http({
			method:'GET',
			url:'http://127.0.0.1:80/crud/api/single_read.php?id='+id,
			
			
		}).success(function(data){
			$scope.nombre = data.nombre;
			$scope.correo = data.correo;
			$scope.edad = data.edad;
			$scope.puesto = data.puesto;
			$scope.hidden_id = id;
			$scope.modalTitle = 'Editar Datos';
			$scope.submit_button = 'Edit';
			$scope.openModal();
		});		
	};

	$scope.deleteData = function(id){	

		Swal.fire({
			title: 'Estas seguro?',
			text: "No podra revertir loa cambios",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Borrado!'
		  }).then((result) => {
			if (result.isConfirmed) {
				$http({
					method:'POST',
					url:"http://127.0.0.1:80/crud/api/delete.php",
					data:{'id':id}
				})
			  Swal.fire(
				'Deleted!',
				'Your file has been deleted.',
				'success'
			  )
			}
			
		  })
	};

});