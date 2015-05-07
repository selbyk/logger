SYSHOSTNAME=$(hostname)
SYSUUID=$(/sbin/blkid | grep "$(df -h / | sed -n 2p | cut -d" " -f1):" | grep -o "UUID=\"[^\"]*\" " | sed "s/UUID=\"//;s/\"//")
CURDATE=$(date +"%s")
ifstat | awk -v uuid="$SYSUUID" -v date="$CURDATE" -v host="$SYSHOSTNAME" '
function isnum(x){return(x==x+0)}
BEGIN {
  print "{";
  print "  \"silent\": true,";
  print "  \"network\":";
  print "    [";
}
{
  #PID  PPID PRI  NI STAT USER     TT        SESS %CPU %MEM    SZ   RSS COMMAND         COMMAND

  for( i=1 ; i <=NR ; i++ ) {
    gsub(/^[ \t]+/,"",$i);
    gsub(/[ \t]+$/,"",$i);
  }

  if(!isnum($1)){
    printf("%s{\"%s\": ", t, $1)
    for( i=2 ; i <NR ; i++ ) {
      printf(", \"%s\": ", $i)
    }
    printf(", \"%s\": ", $NR)
    {t=",\n"}
  } else {
    printf(", \"%s\": ", $1)
    for( i=2 ; i <NR ; i++ ) {
      printf(", \"%s\": ", $i)
    }
    printf(", \"%s\": }", $NR)
    {t=",\n"}
  }
}

END {
  print "  ]";
  print "}";
}' #| curl --header "Content-Type: application/json" -d @- http://localhost:5005/processes
