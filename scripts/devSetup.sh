# UNIX shell script to check for relevant dependencies and then automatically start up
# frontend Angular Server plus backend dummy server, for example for health-checking

# Notice that even when dependencies are installed this script may fail if the commands
# it checks are not on system path

missing=false

# all the CLI dependencies this project currently checks for
dependencies=(
    "python"
    "python -m uvicorn"
    "npm"
    "ng"
    )
    
echo "Checking all CLI dependencies.."
for command in "${dependencies[@]}"; do
    eval "$command --version &> /dev/null" || {
        echo "Dependency missing: $command. Please check README and install."
        missing=true
    }
done
echo "Good"

# check all the python packages that are in requirements.txt
cd dummy-backend
echo "Checking all required Python Packages.."
while read package; do
    python -c "import $package" &> /dev/null || {
        echo "$package is missing!"
        exit 1
    }
done < requirements.txt
cd ..

if [[ "$missing" == "true" ]]; then
    exit 1
fi


echo "Starting dummy backend server.."
cd dummy-backend
python -m uvicorn main:app --reload &> backend_log.txt < /dev/null &
cd ..

echo "Starting Angular frontend.."
cd frontend
ng serve &> frontend_log.txt < /dev/null &
cd ..

echo "All done. Check out http://localhost:4200 to see if your setup is healthy"
echo "[Terminate all running servers by closing this shell]"
exit 0