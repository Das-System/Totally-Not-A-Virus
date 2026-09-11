start_containers:
	cd .devcontainer && docker compose up -d 
stop_containers:
	cd .devcontainer && docker compose down
attach_to_apache:
	cd .devcontainer && docker compose exec apache bash
rebuild_containers:
	cd .devcontainer && docker compose up -d --build