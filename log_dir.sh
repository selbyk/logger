SYSHOSTNAME=$(hostname)
SYSUUID=$(/sbin/blkid | grep "$(df -h / | sed -n 2p | cut -d" " -f1):" | grep -o "UUID=\"[^\"]*\" " | sed "s/UUID=\"//;s/\"//")
CURDATE=$(date +"%s")
du / | awk -v uuid="$SYSUUID" -v date="$CURDATE" -v host="$SYSHOSTNAME" '
BEGIN {
  print "{";
  print "  \"silent\": true,";
  print "  \"dirs\":";
  print "    [";
}
{
  if ($1 > 102400) {
    if ($2 != "/") {
      print "    {\"time\": \"" date "\", \"uuid\": \"" uuid "\", \"hostname\": \"" host "\", \"path\": \"" $2 "\", \"size\": " $1 "},";
    } else {
      print "    {\"time\": \"" date "\", \"uuid\": \"" uuid "\", \"hostname\": \"" host "\", \"path\": \"" $2 "\", \"size\": " $1 "}";
    }
  }
}
END {
  print "  ]";
  print "}";
}' | curl --header "Content-Type: application/json" -d @- http://localhost:5005/dirs
