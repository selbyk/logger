SYSHOSTNAME=$(hostname)
SYSUUID=$(/sbin/blkid | grep "$(df -h / | sed -n 2p | cut -d" " -f1):" | grep -o "UUID=\"[^\"]*\" " | sed "s/UUID=\"//;s/\"//")
CURDATE=$(date +"%s")
du / | \
awk -v uuid="$SYSUUID" -v date="$CURDATE" -v host="$SYSHOSTNAME" '
 BEGIN {
   print "{";
   print "  \"silent\": true,";
   print "  \"dirs\":";
   print "    [";
 }
 {
   if ($1 > 102400) {
     if ($2 != "/") {
       parent = gensub(/^\/?(.*)\/.+$/, "/\\1", "gm", $2);
       printf("    {\"time\": \"%s\", \"uuid\": \"%s\",\"hostname\": \"%s\",\"path\": \"%s\",\"size\": %d,\"parent\": \"%s\"},\n", date, uuid, host, $2, $1, parent);
       #print "    {\"time\": \"" date "\", \"uuid\": \"" uuid "\", \"hostname\": \"" host "\", \"path\": \"" $2 "\", \"size\": " $1 "},";
     } else {
       printf("    {\"time\": \"%s\", \"uuid\": \"%s\",\"hostname\": \"%s\",\"path\": \"%s\",\"size\": %d}\n", date, uuid, host, $2, $1);
     }
   }
 }
 END {
   print "  ]";
   print "}";
 }' | \
curl --header "Content-Type: application/json" -d @- http://localhost:5005/dirs
# | sed -r 's#^([0-9]+)(.+)(/.+)$#\1\2\3\2#gm'
