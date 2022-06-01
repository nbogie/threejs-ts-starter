	for arg in ${@:2}
	do
		echo would check out $arg
        echo would merge $1
        git checkout $arg
		#merge $1		
	done