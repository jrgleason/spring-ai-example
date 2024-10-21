// use wiki;
print("Connected to database: " + db.getName());
print("Collections in this database: " + JSON.stringify(db.getCollectionNames()));
var count = db.vector_store.countDocuments();
print("Document count in vector_store: " + count);
try {
    var count = db.vector_store.aggregate(
        [{
            "$vectorSearch": {
                "queryVector": [-0.004953867755830288, -0.02700646035373211, -0.003565309103578329, -0.014985701069235802, -0.018420204520225525, 0.020352112129330635, -0.016448048874735832, -0.0265637319535017, -0.00915643759071827, -0.011859767138957977, 0.00760688679292798, 0.006111000198870897, -0.006238452158868313, 4.117042990401387E-4, -0.03839666768908501, 0.008351476863026619, 0.0434679239988327, 0.0036860532127320766, 0.026000259444117546, -0.03598178178071976, -0.02750285342335701, -0.0027318382635712624, 0.011564615182578564, -0.02559777908027172, -0.024886729195713997, 0.017293257638812065, 0.008579548448324203, -0.01705176942050457, 0.011336542665958405, -0.007653843145817518, -0.012631189078092575, -0.012483612634241581, -0.027744341641664505, -0.035954952239990234, -0.014086827635765076, 0.0015780600951984525, -0.004058348014950752, 0.005822555627673864, 0.005607898812741041, 0.006614101119339466, 0.02153272181749344, 0.003736363258212805, -0.01655537635087967, -0.011645111255347729, -0.020043542608618736, 0.0011655172565951943, -0.013369070366024971, 0.008572841063141823, -0.0032701564487069845, 0.0064027984626591206, 0.022887740284204483, -0.005742059089243412, -0.0034076706506311893, -0.016045566648244858, 0.011383498087525368, 0.005926529876887798, 0.004581572953611612, 0.007144033908843994, -0.0025909701362252235, -0.023867111653089523, -0.007573347073048353, 0.007982535287737846, -0.01328186597675085, 0.022632837295532227, -0.01803113892674446, -5.403094837674871E-5, -0.005406658630818129, 0.0010003324132412672, 0.013228202238678932, 0.011591446585953236, 0.029327433556318283, 0.027958998456597328, 0.013805091381072998, -6.464847829192877E-4, 0.019909383729100227, -0.029327433556318283, -0.01996304653584957, -0.01784331537783146, -1.9086393876932561E-4, 0.01946665346622467, 0.016649289056658745, -0.0324399508535862, -0.02801266312599182, 0.008096572011709213, 0.017253009602427483, 0.011303002014756203, -0.0037900274619460106, 0.01593823917210102, -0.00803619995713234, -0.009424758143723011, 0.001955385785549879, 0.030508043244481087, 0.004779459442943335, 0.010900521650910378, -0.01077977754175663, 0.005346286576241255, -0.018084803596138954, 0.03007873147726059, -0.0015512279933318496, -0.03249361738562584, -0.013060501776635647, 7.806450594216585E-4, -0.01230249647051096, -0.012114671990275383, -0.012094547972083092, -0.007506266701966524, 0.005031009670346975, 0.006416214630007744, 0.04985395446419716, -0.020513104274868965, -0.02169371396303177, 0.032735105603933334, 0.006956209894269705, -0.04089204967021942, -0.02685888484120369, 0.0034043167252093554, 0.01768232323229313, 3.2387126702815294E-4, -0.010223012417554855, 0.011249338276684284, 0.013818507082760334, 0.005594483111053705, 0.03364739567041397, -0.021183906123042107, 0.004403810482472181, 0.008727124892175198, 4.282647278159857E-4, -0.004128782078623772, 0.007687383331358433, -0.007090369705110788, 0.021613217890262604, 0.00996810756623745, 0.028227319940924644, -0.005369764752686024, -0.019734974950551987, 0.0016879037721082568, -0.03249361738562584, 0.008029491640627384, -0.007452602498233318, -0.024564744904637337, 0.008438680320978165, 0.026805220171809196, -0.020486272871494293, -0.01672978512942791, -0.011457286775112152, 0.023075565695762634, 0.03104468435049057, 0.008559424430131912, 0.012517152354121208, -0.0016233391361311078, 0.0066107469610869884, -0.03254728019237518, 0.015428430400788784, -0.013731302693486214, 0.005812493618577719, 0.0066912430338561535, 0.016018735244870186, 0.03555246815085411, -0.010712697170674801, 0.016528544947504997, -0.002114701084792614, 0.0025725229643285275, 0.016474880278110504, -0.002419915748760104, 0.013416026718914509, 0.04054323211312294, 0.018795853480696678, 0.006409506779164076, 0.014408811926841736, -0.022793829441070557, -8.41436383780092E-4, 0.013234909623861313, -0.03429136425256729, 0.016850529238581657, 0.0043434384278953075, 0.04684876278042793, 0.004762689583003521, -0.002928047673776746, -0.017950642853975296, -0.018903180956840515, -0.026510067284107208, -0.011765855364501476, 0.01656879298388958, 0.04172384366393089, -0.026778388768434525, -0.0018094865372404456, 0.017803067341446877, 0.014274652116000652, -0.002973326947540045, -0.02475256845355034, -0.002056006109341979, 0.009196685627102852, 0.02989090606570244, -0.001355018699541688, -0.6894764304161072, -0.017092017456889153, -0.0024668718688189983, -9.089357918128371E-4, -9.78531432338059E-4, 4.1715457336977124E-4, 0.025195296853780746, 0.003602202981710434, -0.03316441550850868, 0.0020442670211195946, -0.010263260453939438, 0.017172513529658318, 0.028119990602135658, -0.005641438998281956, -0.020714344456791878, -0.006728137377649546, 0.01605898328125477, 0.012342744506895542, 0.001772592426277697, 0.0030638850294053555, -0.00788191519677639, 0.014207571744918823, 0.005648147314786911, 0.001186479814350605, -0.0031963682267814875, -0.0143953962251544, 0.003649159101769328, -0.022632837295532227, -8.971967617981136E-4, -0.011993927881121635, -0.025611193850636482, 0.005306038539856672, 0.012865968979895115, -0.010759653523564339, 0.02946159429848194, -7.835797732695937E-4, -0.026899132877588272, 0.04773422330617905, 0.005161816254258156, 0.04971979185938835, -0.002869352698326111, -0.012570817023515701, 0.02881762385368347, 0.017494497820734978, -0.015482094138860703, 0.001111014629714191, 0.047868382185697556, 0.007345274556428194, -5.638923612423241E-4, -0.00744589464738965, 0.0028073035646229982, -0.007586762774735689, 0.007351982407271862, 0.01867510937154293, 0.01638096757233143, -0.007076954003423452, 0.036894071847200394, -0.02655031532049179, 0.011591446585953236, -0.005423428490757942, -0.005524049047380686, 0.016474880278110504, -0.015817495062947273, -0.03276193514466286, -0.013751426711678505, -0.0010615431237965822, -0.0076806750148534775, -0.0024433936923742294, 0.0062350984662771225, 0.0020392360165715218, 0.009679662995040417, 0.026617396622896194, 0.012476904317736626, 0.005755475256592035, 0.023370718583464622, 0.014516140334308147, 0.026738140732049942, -0.01190001517534256, -0.016796864569187164, 0.012597648426890373, -0.013395902700722218, 0.002914631739258766, -0.01055170502513647, -0.017185930162668228, 0.025369705632328987, -0.0073050265200436115, -0.01575041562318802, -4.314091056585312E-4, 0.01754816249012947, -4.745919432025403E-4, 0.0015151724219322205, 0.014864956960082054, 5.40414301212877E-4, -0.0077477553859353065, 0.01366422325372696, 0.0013365716440603137, -0.0048834336921572685, -0.006124415900558233, 0.004101950209587812, -0.024189095944166183, -6.90086861141026E-4, -5.928206373937428E-4, 0.02946159429848194, -0.012839137576520443, 0.030186058953404427, 0.009713202714920044, -0.025342874228954315, 0.014207571744918823, 0.02041919156908989, -0.03555246815085411, -0.0010045249946415424, -6.175564485602081E-4, -0.002545691095292568, 0.007928871549665928, 0.0030152518302202225, -0.023558542132377625, 0.02444400079548359, 0.02766384556889534, 0.025155048817396164, -0.040140751749277115, 0.006453108508139849, -0.015643086284399033, -0.009357678703963757, -0.022753581404685974, 0.01384533941745758, 0.008908241055905819, -0.0021348251029849052, -0.005423428490757942, -0.0029582337010651827, -0.0011395236942917109, 0.006996457930654287, -0.010182764381170273, 0.01592482253909111, 0.0048599555157125, 0.010269967839121819, 0.0013063856167718768, -0.005795723292976618, -0.015254021622240543, 0.017642075195908546, -0.01055170502513647, -0.016957856714725494, -0.008452096953988075, 0.0048163533210754395, -0.0038738776929676533, 0.01456980500370264, -0.02881762385368347, 0.0018044555326923728, -0.01575041562318802, -0.02094241790473461, -0.005111506208777428, 6.71220594085753E-4, -0.011497534811496735, -0.003857107600197196, -0.002243830356746912, 0.015254021622240543, -0.02881762385368347, -0.005188648123294115, -0.008619796484708786, -0.021277816966176033, 6.024634349159896E-4, -0.0020727759692817926, 0.026322243735194206, -0.016032151877880096, 0.018406787887215614, -0.001550389570184052, -0.004491014871746302, 0.02090216986835003, 0.013006837107241154, -0.005406658630818129, -0.028227319940924644, 0.015804078429937363, 0.0016694568330422044, -0.006634225137531757, 0.022914573550224304, 0.011021265760064125, 0.008391724899411201, -0.009424758143723011, -0.019506901502609253, 0.006084167864173651, -0.006325656548142433, 0.01658220775425434, -0.004534617066383362, -0.03238628804683685, 0.002762024523690343, 0.037055063992738724, -0.004122074227780104, 4.01013414375484E-4, 0.028361478820443153, -0.026255164295434952, 0.018594613298773766, -0.015696750953793526, -0.012805596925318241, 0.007090369705110788, 0.010826732963323593, -0.0148917892947793, -2.0019226940348744E-4, 0.0312056764960289, 0.00964612327516079, 0.0016342396847903728, 0.002966618863865733, 0.04132135957479477, 0.006288762204349041, 0.01576383039355278, -0.004423934500664473, 0.03246678411960602, -0.021492473781108856, 0.003151089185848832, -0.0042629423551261425, 0.03286926448345184, 0.02511480078101158, -0.004494369029998779, -0.020794840529561043, -0.0073117343708872795, -0.00728490250185132, 0.001552066532894969, 0.030481211841106415, -0.0035887870471924543, 0.009364386089146137, 0.005316100548952818, -0.015294269658625126, -0.02044602483510971, 0.0062350984662771225, 0.03571346402168274, 0.01029009185731411, 0.00237295962870121, 0.007834959775209427, -0.014703964814543724, 0.04019441455602646, 0.006775093264877796, -0.032574113458395004, 0.004779459442943335, -0.010652325116097927, -0.007922163233160973, 0.02732844650745392, -0.011343250051140785, 0.005121568217873573, 0.012315912172198296, 0.00796911958605051, 0.03493533283472061, -0.023048732429742813, 0.01062549278140068, 0.02463182434439659, 0.025825850665569305, -0.019345909357070923, -0.007519682869315147, -0.01831287518143654, 0.012000635266304016, -0.00853259302675724, -0.021438810974359512, -0.007539806887507439, 0.010974309407174587, 0.007633719127625227, -0.02991773933172226, -0.0021482412703335285, 0.009874195791780949, -0.025195296853780746, 0.022096196189522743, 0.015643086284399033, 0.03474750742316246, 0.022954821586608887, 0.023424381390213966, 0.020231368020176888, 0.007861791178584099, 0.005668271332979202, 0.00933084636926651, 0.010370587930083275, -0.008190483786165714, -0.010048603639006615, 0.011202381923794746, -0.0014363533118739724, -0.003109164070338011, 0.008753957226872444, 0.021130241453647614, -0.013764843344688416, -0.0020979312248528004, 0.011718899011611938, -0.02072776108980179, 0.004990761633962393, 0.003107486991211772, -7.902877987362444E-4, -0.021197320893406868, -0.02830781601369381, 0.0028039494063705206, -0.014301484450697899, -0.011323126032948494, -0.011537782847881317, -0.03732338547706604, -0.006271992344409227, -0.006493356544524431, 0.013214785605669022, 0.0026546961162239313, 0.03557930141687393, -8.070578332990408E-4, -0.01416732370853424, 0.014381980523467064, 0.00805632397532463, 0.00980711542069912, 0.0024601637851446867, 0.0125372763723135, 0.015804078429937363, 0.0017893625190481544, -0.014247819781303406, 0.0010078790364786983, -0.03568663075566292, 0.019694726914167404, 0.01913125440478325, -0.0024836419615894556, -0.024980641901493073, -0.011906723491847515, -0.003052145941182971, -0.006567144766449928, 0.0012434979435056448, -0.02895178459584713, -0.009203393943607807, -0.0054301368072628975, -0.007834959775209427, -0.013711178675293922, -0.0030856861267238855, 0.020150871947407722, 0.00474591925740242, -0.010417544282972813, 0.01110176183283329, -0.018862932920455933, -0.0024702257942408323, 0.04483636096119881, 0.03700140118598938, 0.0021012851502746344, 0.01945323869585991, -0.01166523527354002, 0.004973991774022579, -0.034532852470874786, -0.014274652116000652, 0.0060640438459813595, -0.010759653523564339, 0.009042401798069477, -0.021921787410974503, 0.010618784464895725, -0.007533099036663771, 0.010960893705487251, 0.00883445329964161, -0.01917150244116783, -0.013657514937222004, -0.005624669138342142, -0.03423769772052765, -0.013623975217342377, -0.018218964338302612, -0.00538318045437336, 0.017574993893504143, 0.011645111255347729, -0.004199216142296791, 0.005279206205159426, 0.013939251191914082, -0.0014958869433030486, 0.0036625752691179514, 0.002012403914704919, 0.009833947755396366, 0.0016292086802423, 0.003048792015761137, -0.0075934710912406445, 0.010705988854169846, -0.00247357995249331, -0.004423934500664473, 0.012168335728347301, -3.6076531978324056E-4, 0.007653843145817518, 0.020056959241628647, -0.0012233739253133535, -0.02204253152012825, 0.01787014678120613, -0.02347804605960846, 0.02543678507208824, 8.410171722061932E-4, 0.014462476596236229, -0.025852682068943977, 0.00803619995713234, 0.00708366185426712, -0.030588539317250252, 0.003365745535120368, -0.010565120726823807, 0.0328156016767025, -0.0018950137309730053, 0.0030152518302202225, -0.009605875238776207, -0.00805632397532463, -0.0015529050724580884, -0.023062149062752724, 0.0059835477732121944, -0.016649289056658745, -0.00538318045437336, -0.024363504722714424, -0.01737375371158123, 0.02108999341726303, -0.00755993090569973, -0.01182622741907835, -0.007989243604242802, -0.01850070059299469, -0.017588410526514053, 0.0017013198230415583, 0.01672978512942791, 0.0026731432881206274, 0.01562967151403427, -0.012684852816164494, 0.005721935071051121, 0.034371860325336456, -0.007419062778353691, -0.013818507082760334, -0.015093029476702213, -0.012678144499659538, 0.0016912578139454126, 0.011484118178486824, -0.012819013558328152, 4.833962011616677E-4, -0.01591140776872635, 0.02078142575919628, 0.009075941517949104, 0.005041071679443121, 0.009532086551189423, -0.009786991402506828, -0.005054487846791744, -0.0051551079377532005, 0.029193272814154625, 0.005413366481661797, -0.014261236414313316, -0.011873183771967888, 0.012631189078092575, -0.01214150432497263, -0.006369258742779493, -3.995984297944233E-5, -4.724956816062331E-4, -0.005034363828599453, 0.028549304232001305, 0.018916597589850426, -0.01965447887778282, -0.0029917738866060972, 0.011551198549568653, 0.006204911973327398, 0.0022002283949404955, 0.005634731147438288, -0.008411848917603493, 0.009411342442035675, -0.006000317633152008, 0.008713709190487862, 0.006443046499043703, -0.03584762290120125, -0.008163652382791042, -0.030159227550029755, 0.03294976055622101, 0.03938945382833481, -0.024672072380781174, 0.014046579599380493, -0.002433331683278084, -0.02110341005027294, -0.003444564761593938, -0.008653337135910988, 0.00139610527548939, 0.010236428119242191, 0.014274652116000652, -0.009223517961800098, -0.029488425701856613, -0.026416156440973282, -0.0062350984662771225, 0.01004189532250166, -0.0036659291945397854, 0.00506454985588789, -0.02881762385368347, 0.01832629181444645, 0.008753957226872444, -0.03303025662899017, -0.007264778483659029, -0.0579572357237339, 0.0054435525089502335, 0.0060573359951376915, -0.001526911510154605, 0.034532852470874786, -0.013154413551092148, 0.007821543142199516, -0.006305532529950142, 0.0037900274619460106, -0.02849563956260681, -0.054603226482868195, -0.013040377758443356, -0.0030202828347682953, 0.019399574026465416, 0.02511480078101158, 0.026832053437829018, -0.012577524408698082, 0.0010154255433008075, 0.014623468741774559, 0.007781295105814934, -0.008928366005420685, -0.003340590512380004, 0.0011235922574996948, -0.022592589259147644, 0.04121403396129608, 0.05020277202129364, 0.011785979382693768, 0.004212632309645414, 0.007647134829312563, -0.010229719802737236, 0.0012342744739726186, 0.003857107600197196, -0.012242124415934086, -0.0043803327716887, -0.015535758808255196, 0.00878078956156969, -0.0076001789420843124, -0.007224529981613159, -0.01962764747440815, 0.003957727923989296, -0.002471902873367071, 0.009465006180107594, -0.0017625304171815515, 0.007023289799690247, -0.023679286241531372, 0.021988866850733757, -0.01788356341421604, 0.018930012360215187, 0.005413366481661797, -0.003830275498330593, -5.848549189977348E-4, -0.026510067284107208, 6.565467920154333E-4, 0.0021532722748816013, 0.0318228155374527, -0.015522342175245285, 0.014583220705389977, -0.007325150538235903, -0.018125051632523537, 3.576733433874324E-5, 0.023236557841300964, -0.0038940017111599445, -0.02620149962604046, 0.005007531959563494, -0.013382486067712307, -0.014583220705389977, -0.027771174907684326, -0.030212892219424248, -0.020955832675099373, -0.012604356743395329, -0.0017340213526040316, -0.014502724632620811, 0.011537782847881317, -0.011497534811496735, -0.011752438731491566, 0.010350463911890984, -3.5762094194069505E-4, 0.029381098225712776, 0.01655537635087967, 0.04250197112560272, 0.015428430400788784, 0.010685864835977554, -0.021277816966176033, 0.019238581880927086, -0.0051484000869095325, 3.0500497086904943E-4, 0.014462476596236229, 0.007117202039808035, 0.023571958765387535, -0.008666752837598324, -0.009129606187343597, -0.007217822130769491, -0.008807620964944363, -0.030320219695568085, 0.011249338276684284, 0.03195697441697121, 0.0013323790626600385, -0.0018950137309730053, -0.00957904290407896, -0.024390336126089096, 0.023115813732147217, -0.009002153761684895, 0.0012066038325428963, -0.02059360034763813, -0.027958998456597328, -0.014824708923697472, 0.010370587930083275, -0.002869352698326111, 0.021183906123042107, 0.0036323892418295145, -0.031447164714336395, -0.009545503184199333, -0.01788356341421604, -0.015562590211629868, -0.00599360978230834, -0.019573982805013657, 0.02994457073509693, -0.017333505675196648, 0.004356854595243931, 0.01141703873872757, 0.012617772445082664, -0.010826732963323593, -0.030025066807866096, -0.0228474922478199, 0.021479059010744095, -0.0328156016767025, 0.005336224567145109, 0.017440835013985634, -0.011343250051140785, 0.013389194384217262, -0.004450766835361719, -0.008619796484708786, -0.029488425701856613, -2.036510850302875E-4, -0.04421922191977501, 0.004306544549763203, 0.010015063919126987, -0.02333047054708004, 0.011980511248111725, -0.022149858996272087, -0.020566768944263458, -0.025047721341252327, -0.009337554685771465, 0.021277816966176033, 0.0036994693800807, -0.013556894846260548, -0.014771045185625553, -0.010410836897790432, 0.030320219695568085, 0.007667258847504854, 3.2009801361709833E-4, 0.009364386089146137, 0.03464018180966377, -0.02221694029867649, 0.03040071576833725, -0.037564873695373535, -0.009297306649386883, -0.023773198947310448, 0.0010598660446703434, 0.004568156786262989, -0.034023042768239975, 0.026442987844347954, -0.020204536616802216, 1.5472975064767525E-5, -0.0040851798839867115, 0.013462982140481472, 0.025866098701953888, 0.014757628552615643, -0.008385016582906246, 0.013543478213250637, -0.015736998990178108, 0.009471714496612549, -0.02881762385368347, -0.02059360034763813, 0.03984559699892998, -0.015965070575475693, -0.002963264938443899, 0.015508926473557949, -0.004722441080957651, -0.018621444702148438, -0.004849893506616354, 0.02413543127477169, 0.0011135301319882274, -0.015039365738630295, -0.025007473304867744, 0.003957727923989296, 0.012564108707010746, -0.029810409992933273, -0.011752438731491566, -0.017588410526514053, -0.007627010811120272, -0.0035787250380963087, 0.0033758075442165136, 0.0130336694419384, -0.006778447423130274, -0.006318948231637478, 0.007694091182202101, -0.011624987237155437, 0.014703964814543724, 0.008163652382791042, -0.017937228083610535, 0.003335559507831931, -0.012792181223630905, -0.007734339218586683, -0.010585244745016098, 0.002421592827886343, 0.013885587453842163, 0.019064173102378845, -0.027100373059511185, -0.015334517695009708, 0.011866475455462933, -0.022887740284204483, -0.010209595784544945, 0.015884574502706528, 0.009183269925415516, 0.02188153937458992, 0.013154413551092148, 6.682858220301569E-4, 0.002864321693778038, 6.766708102077246E-4, 0.02448424883186817, -0.028844457119703293, -0.0058057853020727634, 0.01592482253909111, -0.010149223729968071, 0.01880926825106144, -0.004303190391510725, -0.019077589735388756, -0.02382686361670494, 0.0130336694419384, 0.002869352698326111, -0.00853259302675724, 0.017588410526514053, -0.012966589070856571, -0.015388182364404202, -0.013992915861308575, -0.001216665841639042, 0.030615372583270073, 0.001720605418086052, 0.030212892219424248, -0.026899132877588272, -0.006010379642248154, 0.017078600823879242, -2.175911795347929E-4, -0.02110341005027294, -0.00413548992946744, 0.0036525132600218058, 0.010498040355741978, 0.004279712215065956, -6.783478311263025E-4, -0.01189330779016018, 0.008586256764829159, -0.024578159675002098, 3.951438993681222E-4, -0.003147735260426998, -0.008324644528329372, 0.027583349496126175, 0.0027704094536602497, -4.236529639456421E-4, 0.010001647286117077, -0.002215321408584714, -0.016622455790638924, -0.014864956960082054, 0.015334517695009708, -0.008203900419175625, -0.004423934500664473, -0.016448048874735832, 0.0073855225928127766, -0.029568921774625778, 0.02927376888692379, -0.014207571744918823, -0.005852741654962301, 0.0055173407308757305, 0.03179598227143288, -0.0011697098379954696, -0.020553352311253548, -0.014516140334308147, 0.014583220705389977, -0.016300471499562263, 0.002426623832434416, -0.030534876510500908, -0.011336542665958405, -0.025946594774723053, -0.025450201705098152, 0.0034713968634605408, -0.005198710132390261, -0.018916597589850426, -0.011973803862929344, 0.0092570586130023, -0.01423440407961607, 0.0033556835260242224, 0.17816482484340668, -0.02445741556584835, -0.011698774993419647, 0.03445235639810562, -0.00401809997856617, 0.0051551079377532005, 0.013590434566140175, 0.014636884443461895, 0.0066778273321688175, -0.003749779425561428, -0.02447083219885826, 0.031098349019885063, -0.018420204520225525, -0.0034311488270759583, 0.01230249647051096, -0.01528085395693779, -0.036115944385528564, -0.01706518605351448, -0.020164286717772484, 0.010202888399362564, 0.007217822130769491, -0.015522342175245285, -0.00878078956156969, -0.019573982805013657, 0.04156285151839256, 0.008418556302785873, -0.0038436916656792164, 0.005933237727731466, 0.03413037210702896, -0.003719593398272991, -0.012886092998087406, -0.006228390149772167, 0.005996963940560818, -0.00683211162686348, -0.005738705396652222, 0.006822049617767334, -0.009927859529852867, -0.007050121668726206, 0.030937356874346733, 0.02911277674138546, -0.002396437805145979, -0.0033003424759954214, -0.0013323790626600385, -0.016689537093043327, 0.0018061324954032898, 0.017105434089899063, -0.006318948231637478, -0.01342273410409689, 0.0011001141974702477, 0.008378308266401291, -0.01037729624658823, 0.012423240579664707, 0.019721558317542076, 0.0386381559073925, -0.01784331537783146, -4.047866677865386E-4, -2.590969961602241E-4, 0.02154613845050335, 0.019399574026465416, 0.010981017723679543, -0.008613089099526405, 0.03217162936925888, -0.009719911031425, -0.0055039250291883945, -0.025517283007502556, 0.005279206205159426, -0.04153601825237274, -0.009377802722156048, -5.34125545527786E-4, -0.03654525429010391, 0.004695609211921692, -0.01055170502513647, 0.011993927881121635, -0.006201558280736208, -0.014824708923697472, -0.026778388768434525, 0.024698903784155846, 0.01656879298388958, 0.018769020214676857, 0.03284243121743202, -0.00900886207818985, -0.006647640839219093, -0.011517658829689026, -9.173207799904048E-4, -0.0049941157922148705, -0.010155932046473026, 0.009605875238776207, 0.025316040962934494, -0.005752121098339558, -0.00219016638584435, -0.00153781205881387, -0.0075934710912406445, -0.012403116561472416, -0.0177091546356678, 0.006372612435370684, 0.008364892564713955, 0.0018933367682620883, 0.022914573550224304, -0.009371094405651093, 0.012725100852549076, -0.007935579866170883, -0.012389699928462505, 0.01976180635392666, 6.645125686191022E-4, 0.004199216142296791, 0.0010187794687226415, -0.008418556302785873, 0.02591976337134838, 0.006969625595957041, -0.006298824213445187, 0.0034311488270759583, -0.008338060230016708, 0.008431972935795784, -0.014690549112856388, 0.045453496277332306, -0.009210102260112762, -0.0012292434694245458, -0.026966212317347527, 0.006956209894269705, 8.468866581097245E-4, -0.002944817766547203, -0.0011797718470916152, -0.003050469094887376, 0.011524366214871407, -0.004437350668013096, -0.020808257162570953, -0.03088369220495224, 0.026013674214482307, 0.0025708461180329323, -0.025933178141713142, 8.20893095806241E-4, -0.0033204664941877127, -0.001326509634964168, -0.010115684010088444, -0.004202570300549269, -0.007546514738351107, 0.0052456664852797985, -0.0050008236430585384, -0.013791674748063087, 0.009062525816261768, -0.00635584257543087, -0.001822902588173747, 0.029005449265241623, -0.0034781049471348524, 0.006067398004233837, -0.02539653703570366, 0.025624610483646393, -0.01674320176243782, -0.0076739671640098095, -0.02459157630801201, -0.018795853480696678, -0.0012141503393650055, 0.004091888200491667, -0.004286420531570911, 0.021962035447359085, 4.620144027285278E-4, -0.039335791021585464, -0.017427418380975723, 0.0030202828347682953, -0.003199722385033965, -0.03458651527762413, 7.194344070740044E-4, 0.004870017524808645, -0.009310722351074219, -0.011591446585953236, 0.001500079408288002, -0.17494498193264008, 0.006221682298928499, 0.021492473781108856, -0.010987726040184498, 0.019050758332014084, 0.007164157927036285, 0.0034982289653271437, 0.012738517485558987, -2.9221782460808754E-4, 0.007425770629197359, 0.019184917211532593, 0.005809139460325241, -0.04472903162240982, -0.0025473679415881634, 6.561275222338736E-4, 0.004484307020902634, -0.013140997849404812, 0.0024383626878261566, 0.009143021889030933, 0.017320090904831886, 0.04596330597996712, -0.017642075195908546, 0.005212126299738884, -0.014636884443461895, 1.9206929209758528E-5, 0.0030353760812431574, 0.015146694146096706, 0.016166312620043755, -0.003813505405560136, -0.02590634673833847, -0.01882268488407135, -0.010323632508516312, 0.022632837295532227, 0.006339072249829769, 0.012731809169054031, -0.012416532263159752, 4.3727862066589296E-4, -0.016676120460033417, -0.014274652116000652, 0.029059113934636116, 0.00940463412553072, 0.03598178178071976, 0.0068690055049955845, 0.00796911958605051, -0.008304520510137081, 0.02445741556584835, 0.008016075938940048, 0.014207571744918823, 0.007251362316310406, -0.005165169946849346, -0.003910771571099758, -0.01134995836764574, 0.0048599555157125, 0.017185930162668228, 0.017185930162668228, 0.005721935071051121, -0.003961081616580486, 0.036759912967681885, -0.0011671943357214332, -0.018701940774917603, -0.00901556946337223, -0.01037729624658823, 0.005185293965041637, 0.013228202238678932, -0.010907229036092758, -0.014529556967318058, -0.0073989387601614, 0.022766996175050735, -0.02608075551688671, 0.006231744308024645, -0.008901533670723438, -0.018071386963129044, 0.023880526423454285, -0.03619644045829773, -0.00996810756623745, 0.012470196932554245, 0.010363880544900894, 0.01595165580511093, 0.023223141208291054, -0.017414001747965813, -0.008257564157247543, 0.04695609211921692, -0.025517283007502556, 0.004115365911275148, -0.009619290940463543, 0.005571004934608936, -0.006074105855077505, 4.724956816062331E-4, 0.004014745820313692, -0.01310074981302023, 0.0157906636595726, -0.021197320893406868, 9.131283150054514E-4, -0.022579172626137733, 0.012912925332784653, -0.0036357431672513485, 0.019386157393455505, 0.012725100852549076, 0.005819201469421387, 0.005131630226969719, 0.002681528218090534, 0.003384192707017064, -0.030186058953404427, 0.03308391943573952, 0.034693844616413116, -9.994939900934696E-4, 0.0010363879846408963, 0.02732844650745392, 0.04451437667012215, -1.65813704370521E-4, -0.021586386486887932, -0.006902545690536499, 0.019412990659475327, 0.005420074798166752, -0.014596636407077312, 0.0111755495890975, -0.015656502917408943, 0.011993927881121635, 0.016515128314495087, -0.001462346874177456, 0.028254151344299316, 0.00899544544517994, 0.00390406372025609, -0.004990761633962393, 0.015227190218865871, -0.00401809997856617, -0.0933755412697792, -2.815269399434328E-4, 0.027261365205049515, 0.03104468435049057, 0.0016770033398643136, -0.004930389579385519, -0.015401598066091537, 0.018755605444312096, 0.005980193614959717, 0.010095559991896152, -0.02750285342335701, -0.03345957025885582, -0.009270474314689636, 0.0076806750148534775, -0.003934249747544527, -0.0014883404364809394, -0.0023042026441544294, -0.0318228155374527, -0.025007473304867744, 0.00703670596703887, -7.651327905477956E-6, -0.0037162392400205135, 0.009350970387458801, 0.0046318829990923405, -0.01494545303285122, 0.0017155744135379791, -0.02410859987139702, 0.03303025662899017, -0.005299330223351717, -0.005456968676298857, 0.007982535287737846, 0.012470196932554245, 0.00821731612086296, -0.03246678411960602, -0.00915643759071827, -0.025168465450406075, -0.004242818336933851, -0.009089358150959015, 0.026603979989886284, -9.273828472942114E-4, 0.020164286717772484, 0.028522472828626633, 0.025517283007502556, -0.010504748672246933, -0.0034277946688234806, -0.014502724632620811, -0.03426453098654747, 0.03622326999902725, -0.013939251191914082, -0.016139479354023933, -0.03222529590129852, -0.0022891093976795673, -0.030481211841106415, -0.03142033517360687, 0.022149858996272087, 7.663905271328986E-4, -0.01116884220391512, 0.023290222510695457, -0.012195168063044548, 0.0014455768978223205, 0.01304708607494831, -0.002705006394535303, 0.001745760440826416, 0.029407929629087448, 0.0035082909744232893, -0.004507784731686115, -0.024725737050175667, -0.013724595308303833, 0.007338566239923239, -0.0057018110528588295, 0.0038202134892344475, -0.0022337683476507664, -0.0011521013220772147, 0.026295412331819534, -0.02494039386510849, 0.009236934594810009, -0.015160109847784042, -0.007499558851122856, 0.022069362923502922, -0.020955832675099373, 0.004239464178681374, -0.011906723491847515, 0.03201063722372055, -0.023773198947310448, 0.02524896152317524, 2.5029273820109665E-4, 0.004910265561193228, -5.849859007867053E-6, 0.004474245011806488, -0.01788356341421604, 0.012436656281352043, 0.026469819247722626, -0.0017541454872116446, -0.0053328704088926315, -0.006614101119339466, 0.001982217887416482, 0.004645299166440964, 0.010638908483088017, -0.027744341641664505, 0.019694726914167404, -0.006406152620911598, -0.005181940272450447, -0.06305532157421112, 0.01992279849946499, -0.02059360034763813, 0.008707000873982906, 0.031178845092654228, -0.006013733800500631, 0.012664728797972202, -0.018071386963129044, 1.6272171706077643E-5, 0.021116824820637703, -0.01143716275691986, 0.010645616799592972, -0.004138844087719917, 0.006027149967849255, -0.031152013689279556, -0.0177091546356678, 0.01772257126867771, 0.010880397632718086, -0.01006201934069395, 0.020526520907878876, -5.465982758323662E-5, -0.010719405487179756, 0.0019470008555799723, 0.00780812744051218, -0.01782989874482155, 0.005379826761782169, 0.013778259046375751, 0.013858755119144917, 0.0032668025232851505, -0.02801266312599182, 0.005007531959563494, -0.034828003495931625, -0.006600684951990843, 0.012691561132669449, 0.005557588767260313, -0.020969249308109283, -0.013610558584332466, 0.0015302655519917607, 0.005037717986851931, 0.0011638402938842773, -0.016206560656428337, -0.025664858520030975, 0.011229214258491993, -0.019681310281157494, 0.003994621802121401, 0.005866157356649637, 0.00526579050347209, 0.011074929498136044, -0.004239464178681374, -0.01165181864053011, 0.011034681461751461, 0.017776234075427055, -0.014811293222010136, -0.0019973109010607004, 0.006188142113387585, -0.01914466917514801, 0.022753581404685974, -0.009096065536141396, -0.015160109847784042, -0.05629364773631096, 0.03662575036287308, 0.00924364197999239, -0.004407164640724659, -0.02075459249317646, 0.022243771702051163, 0.0012040883302688599, -0.029864074662327766, -0.01312087383121252, 0.014663716778159142, -0.014355148188769817, -0.03088369220495224, -0.004578218795359135, 0.01627364009618759, 0.010860273614525795, 0.011732314713299274, 8.963582804426551E-4, -0.005731997080147266, -0.01996304653584957, -0.027100373059511185, 0.01961423084139824, 0.007694091182202101, 0.006540312897413969, -0.028871288523077965, 0.0024484246969223022, 0.027771174907684326, 9.684693941380829E-5, 0.0042629423551261425, 0.008968614041805267, 0.015576006844639778, 0.011195673607289791, -0.01575041562318802, 0.017239592969417572, 0.01929224655032158, 0.007828251458704472, 0.0010103945387527347, 0.027288198471069336, -0.010672449134290218, -0.02008379064500332, 0.03651842474937439, 0.02271333336830139, 1.96943074115552E-4, -0.02347804605960846, -0.0020912231411784887, -0.027744341641664505, -0.0032232003286480904, 0.0068757133558392525, -0.010424252599477768, -0.03678674250841141, 0.0035351228434592485, 0.02121073752641678, 0.011336542665958405, 0.00458492711186409, 0.018715357407927513, 0.02153272181749344, -0.01740058697760105, 0.01915808580815792, 5.974324303679168E-4, -0.026456404477357864, -0.022793829441070557, 0.025141634047031403, 0.01608581468462944, 0.028388312086462975, -5.307715618982911E-4, 8.037038496695459E-4, 0.008418556302785873, -0.010189471766352654, 0.008143528364598751, -0.019386157393455505, 0.01643463224172592, 0.0017273133853450418, 0.013603851199150085, 0.0019486778182908893, -0.018393371254205704, -0.04472903162240982, -0.014650301076471806, -0.010249843820929527, 0.0013332176022231579, 0.009149730205535889, -0.034988995641469955, 0.06997799128293991, 0.025342874228954315, -0.014703964814543724, 0.005369764752686024, 0.0034210868179798126, 0.006221682298928499, -0.011410330422222614, 0.012684852816164494, -0.01561625488102436, -0.016139479354023933, 0.012242124415934086, -0.01132983434945345, -0.0017860084772109985, -0.02091558463871479, -0.012839137576520443, 0.003964435774832964, 0.006607392802834511, 0.027878502383828163, -4.724956816062331E-4, 0.0010196180082857609, 0.009230226278305054, -0.006969625595957041, 0.008230731822550297, 0.011853059753775597, -0.02394760772585869, -0.025530697777867317, 0.006181434262543917, -0.0010481270728632808, -0.018755605444312096, -0.016139479354023933, 0.02347804605960846, 0.00813011173158884, -0.03007873147726059, -0.011182257905602455, 0.01400633156299591, 0.0032919575460255146, -0.03697456791996956, -0.0024869958870112896, -0.002218675334006548, 0.01766890659928322, -0.005966777913272381, 0.037564873695373535, -0.017601827159523964, -0.026966212317347527, 0.009974815882742405, 0.011142009869217873, -0.014932037331163883, 7.982535753399134E-4, -0.010404128581285477],
                "path": "embedding",
                "numCandidates": 500,
                "index" : "vector_index",
                "limit" : 4
            }
        }, {
            $count: "totalMatches"
        }
        ]).toArray();

// Print the count
    if (count.length > 0) {
        print("Total matches: " + count[0].totalMatches);
    } else {
        print("No matches found");
    }
} catch(ex){
    print(ex);
} finally{
    quit();
}