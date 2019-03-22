#!/bin/bash

export MIX_ENV=prod
export PORT=4796
export HOME=/home/tasks3/tasks3

echo "Stopping old copy of app, if any..."

/home/tasks3/tasks3/_build/prod/rel/tasks3/bin/tasks3 stop || true

echo "Starting app..."

# Start to run in background from shell.
#_build/prod/rel/memory/bin/memory start

# Foreground for testing and for systemd
/home/tasks3/tasks3/_build/prod/rel/tasks3/bin/tasks3 foreground

# DONE: Add a cron rule or systemd service file
#       to start your app on system boot.

