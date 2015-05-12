SYSHOSTNAME=$(hostname)
SYSUUID=$(/sbin/blkid | grep "$(df -h / | sed -n 2p | cut -d" " -f1):" | grep -o "UUID=\"[^\"]*\" " | sed "s/UUID=\"//;s/\"//")
CURDATE=$(date +"%s")
ifstat | awk -v uuid="$SYSUUID" -v date="$CURDATE" -v host="$SYSHOSTNAME" '
BEGIN {
  print "{";
  print "  \"silent\": true,";
  print "  \"network\": [";
}
NR < 4  { next }
{
  if(NF == 9){
    printf("%s    {\"%s\": ", t, $1)
    for( i=2 ; i <NF ; i++ ) {
      printf(", \"%s\": ", $i)
    }
    printf(", \"%s\": ", $NF)
    {t=",\n"}
  } else if(NF == 8) {
    printf(", \"%s\": ", $1)
    for( i=2 ; i <NF ; i++ ) {
      printf(", \"%s\": ", $i)
    }
    printf(", \"%s\": }", $NF)
    {t=",\n"}
  }
}
END {
  print "\n  ]";
  print "}";
}' #| curl --header "Content-Type: application/json" -d @- http://localhost:5005/network
