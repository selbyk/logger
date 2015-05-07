SYSHOSTNAME=$(hostname)
SYSUUID=$(/sbin/blkid | grep "$(df -h / | sed -n 2p | cut -d" " -f1):" | grep -o "UUID=\"[^\"]*\" " | sed "s/UUID=\"//;s/\"//")
CURDATE=$(date +"%s")
ps --no-headers -axo pid,ppid,pri,nice,sess,pcpu,pmem,sz,rss,tty,stat,uname,comm,command | awk -v uuid="$SYSUUID" -v date="$CURDATE" -v host="$SYSHOSTNAME" '
function isnum(x){return(x==x+0)}
BEGIN {
  headers[1] = "pid"
  headers[2] = "ppid"
  headers[3] = "pri"
  headers[4] = "nice"
  headers[11] = "stat"
  headers[12] = "uname"
  headers[10] = "tty"
  headers[5] = "sess"
  headers[6] = "pcpu"
  headers[7] = "pmem"
  headers[8] = "sz"
  headers[9] = "rss"
  headers[13] = "comm"
  headers[14] = "command"

  print "{";
  print "  \"silent\": true,";
  print "  \"processes\":";
  print "    [";
}
{
  #PID  PPID PRI  NI STAT USER     TT        SESS %CPU %MEM    SZ   RSS COMMAND         COMMAND
  printf("%s\n{\"%s\": %s", t, headers[1], $1 )
  for( i=2 ; i <10 ; i++ ) {
    printf(", \"%s\": %s", headers[i], $i )
  }

  if($10 != "?")
    printf(", \"%s\": \"%s\"", headers[10], $10 )

  for( i=11 ; i <14 ; i++ ) {
    printf(", \"%s\": \"%s\"", headers[i], $i )
  }

  printf(", \"%s\": \"", headers[14]);
  for( i=14 ; i <NF ; i++ ) {
    printf( "%s ", $i )
  }
  printf("%s\"}",$NF);
    #if ($2 != "/") {
    #  print "    {\"time\": \"" date "\", \"uuid\": \"" uuid "\", \"hostname\": \"" host "\", \"path\": \"" $2 "\", \"size\": " $14 "},";
    #} else {
    #  print "    {\"time\": \"" date "\", \"uuid\": \"" uuid "\", \"hostname\": \"" host "\", \"path\": \"" $2 "\", \"comm\": " $13 "}";
    #}
    {t=","}
}
END {
  print "  ]";
  print "}";
}' #| curl --header "Content-Type: application/json" -d @- http://localhost:5005/processes
