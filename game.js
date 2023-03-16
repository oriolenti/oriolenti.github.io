let game_data;

let current_room = 0;
let items_picked = [];
let available_doors = 0;

function game (data)
{
	game_data = data;
	
	document.getElementById("terminal").innerHTML = "<p><strong>¡Bienvenidos a ENTIerrame!</strong> El juego de terror definitivo.</p>";
	document.getElementById("terminal").innerHTML += "<p>Te encuentras en "+game_data.rooms[current_room].name+". Tus opciones són: "+game_data.doors[available_doors].id+". ¿Qué quieres hacer?</p>";
}

function terminal_out (info)
{
	let terminal = document.getElementById("terminal");

	terminal.innerHTML += info;

	terminal.scrollTop = terminal.scrollHeight;
}

function parseCommand (command)
{
	console.log("El comando ", command);
	switch (command){
		case "ver":
			terminal_out("<p>"+game_data.rooms[current_room].description+"</p>");
			break;

		case "ir":
			let doors = "";
			let doors_num = game_data.rooms[current_room].doors.length;
			
			for (let i = 0; i < doors_num; i++){
				doors += game_data.rooms[current_room].doors[i]+", ";
			}
			terminal_out("<p>Puedes ir a: "+doors+"</p>");
			break;
			
		case 'coger':
			
			let items = "";
			let items_num = game_data.rooms[current_room].items.length;
				
			for (let i = 0; i < items_num; i++) {
				items += game_data.rooms[current_room].items[i]+" ";
			}
				
			terminalOut("<p>Los items en la sala son: " + items + "</p>");
		
			break;

		case 'inventario':
		
			let items_inventory = "";
			let items_num_inventory = items_picked.length;
			
			for (let i = 0; i < items_num_inventory; i++) {
				items_inventory += items_picked[i] + " ";
			}
			
			terminalOut("<p>El inventario que tienes es: " + items_inventory + "</p>");
		
			break;
			
			default:
			terminalOut("<p><strong>ERROR:</strong> Comando <strong>" + command + "</strong> no encontrado</p>");
	}
}


function getRoomNumber (room)
{
	for (let i = 0; i < game_data.rooms.length; i++){
		if (game_data.rooms[i].id == room){
			return i;
		}
	}

	return -1;
}

function getDoorNumber (door)
{
	for (let i = 0; i < game_data.doors.length; i++){
		if (game_data.doors[i].id == door){
			return i;
		}
	}

	return -1;
}


function parseInstruction (instruction) {
	switch (instruction[0]) {
		
		case 'ver':
		
			let item_number = findItemNumber(instruction[1]);
			
			if (item_number < 0) {
				terminalOut("<p>El objeto<strong> " + instruction[1] + "</strong> no se encuentra en la habitación</p>");
				return;
			}
			
			let item_description = game_data.items[item_number].description;
			
			terminalOut("<p><strong>" + instruction[1] + ":</strong> " + item_description + "</p>");
			
			break;
			
		case 'ir':
			
			let door_number = findDoorNumber(instruction[1]);
			
			if (door_number < 0) {
				console.log("Puerta errónea");
				return;
			}
			
			let room_number = findRoomNumber(game_data.doors[door_number].rooms[0]);
			
			if (room_number == current_room) {
				current_room = findRoomNumber(game_data.doors[door_number].rooms[1]);
			}
			else {
				current_room = room_number;
			}
			
			let next_room_name = game_data.rooms[current_room].name;
			
			terminalOut("<p>Cambiando de habitación a " + next_room_name + "</p>");
			
			break;
			
		case 'coger':
			
			game_data.rooms[current_room].items.forEach(function (item) {
				if (item == instruction[1]) {
				
					let item_num = game_data.rooms[current_room].items.indexOf(item);
					
					if (item_num < 0) {
						console.log("Error al borrar el item de la habitación");
						return;
					}
					
					item_num = findItemNumber(item);
					console.log(game_data.items[item_num]);

					if (game_data.items[item_num].pickable == false) {
						terminalOut("<p>Este objeto no puede coger</p>");
						return;
					}
					
					game_data.rooms[current_room].items.forEach(item => {
						if (item == instruction[1]) {
							items_picked.push(game_data.rooms[current_room].items.splice(item_num, 1));
						}
					});
					
					terminalOut("<p>El objeto<strong> " + item + "</strong> se ha añadido al inventario</p>");
					return;
				}
			});
		
			break;
			
		case 'inventario':

			let item_inventory_num = findItemNumber(instruction[1]);
			
			if (item_inventory_num < 0) {
				terminalOut("<p>Este objeto no se encuentra en tu inventario</p>");
				return;
			}
			
			let item_inventory_description = game_data.items[item_inventory_num].description;
			
			terminalOut("<p><strong>" + instruction[1] + ":</strong> " + item_inventory_description + "</p>");
			
			break;
			
		default:
			terminalOut("<p> Comando no encontrado</p>");
	}
}

function readAction ()
{
	let instruction = document.getElementById("commands").value;
	let instruction_trim = instruction.trim();

	let data = instruction_trim.split(" ");

	if (data.length == 0 || instruction_trim == ""){
		terminal_out("<p><strong>Error</strong>: escribe una instrucción</p>");
		return;
	}

	if (data.length == 1){
		parseCommand(data[0]);
	}
	else{
		parseInstruction(data);
	}

}

fetch("https://oriolenti.github.io/game.json").then(response => response.json()).then(data => game(data));