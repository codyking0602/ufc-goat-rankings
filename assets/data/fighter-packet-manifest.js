// Central manifest for fighter packet modules.
// Add new fighter packet files here instead of growing ranking-data-patches.js.
(function(){
  const VERSION='fighter-packet-manifest-20260706i-khamzat-chimaev';
  const packets=[
    {slug:'demetrious-johnson',version:'20260702a'},
    {slug:'anderson-silva',version:'20260702a'},
    {slug:'khabib-nurmagomedov',version:'20260702a'},
    {slug:'islam-makhachev',version:'20260702a'},
    {slug:'alexander-volkanovski',version:'20260703b'},
    {slug:'randy-couture',version:'20260702a'},
    {slug:'max-holloway',version:'20260703b'},
    {slug:'kamaru-usman',version:'20260702a'},
    {slug:'jose-aldo',version:'20260705b'},
    {slug:'matt-hughes',version:'20260702a'},
    {slug:'daniel-cormier',version:'20260702a'},
    {slug:'stipe-miocic',version:'20260702a'},
    {slug:'dricus-du-plessis',version:'20260705e-prime-195'},
    {slug:'tyron-woodley',version:'20260706b'},
    {slug:'ilia-topuria',version:'20260705a'},
    {slug:'israel-adesanya',version:'20260702a'},
    {slug:'aljamain-sterling',version:'20260703a'},
    {slug:'petr-yan',version:'20260702b'},
    {slug:'cain-velasquez',version:'20260702b'},
    {slug:'merab-dvalishvili',version:'20260702b'},
    {slug:'bj-penn',version:'20260702b'},
    {slug:'dustin-poirier',version:'20260703a'},
    {slug:'tj-dillashaw',version:'20260703a'},
    {slug:'alex-pereira',version:'20260702c'},
    {slug:'chuck-liddell',version:'20260702a'},
    {slug:'dominick-cruz',version:'20260702a'},
    {slug:'francis-ngannou',version:'20260702a'},
    {slug:'charles-oliveira',version:'20260702a'},
    {slug:'henry-cejudo',version:'20260702a'},
    {slug:'conor-mcgregor',version:'20260702a'},
    {slug:'justin-gaethje',version:'20260702d'},
    {slug:'frankie-edgar',version:'20260703b'},
    {slug:'khamzat-chimaev',version:'20260706a'},
    {slug:'lyoto-machida',version:'20260706b'},
    {slug:'sean-strickland',version:'20260706a'},
    {slug:'robert-whittaker',version:'20260706b-round-control'},
    {slug:'sean-omalley',version:'20260706b-round-control'},
    {slug:'dan-henderson',version:'20260703a'},
    {slug:'amanda-nunes',version:'20260702a'},
    {slug:'valentina-shevchenko',version:'20260702a'},
    {slug:'joanna-jedrzejczyk',version:'20260702b'},
    {slug:'ronda-rousey',version:'20260702b'}
  ];
  window.UFC_FIGHTER_PACKET_MANIFEST={
    version:VERSION,
    updated:'2026-07-06',
    purpose:'Central packet list for scalable fighter additions.',
    count:packets.length,
    fighters:packets.map(p=>p.slug),
    packets
  };
})();