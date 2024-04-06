run: run_backend run_frontend

run_backend:
	cd backend && \
	pip install -r requirements.txt && \
	pkill -f "python server.py" || true && \
	python server.py &

run_frontend:
	cd frontend && \
	npm install && \
	npm start

stop:
	pkill -f "python server.py" || true
	pkill -f "npm start" || true

.PHONY: run run_backend run_frontend stop