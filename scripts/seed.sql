insert into se (i, n, st, c) values ('se1', 'season 1', 'a', 0);
insert into t (i, n, ab, d, pr) values
 ('t1','harbour city kraken','hck','east','#123a6b'),
 ('t2','ridgeway wolves','rgw','east','#1d5fa8'),
 ('t3','north bay bears','nbb','east','#0f8a4f'),
 ('t4','lakeshore lightning','lsl','west','#c8102e');
insert into p (i, u, n, t, j, ps, b, st, c) values
 ('p1', null, 'ed gold', 't1', 91, 'c', 'two-way centre.', 'a', 0),
 ('p2', null, 'sam rivers', 't1', 7, 'd', '', 'a', 0),
 ('p3', null, 'kai osei', 't2', 19, 'l', '', 'a', 0),
 ('p4', null, 'milo hart', 't2', 31, 'g', '', 'a', 0);
insert into g (i, s, ty, h, a, hg, ag, ot, dt, st, rc) values
 ('g1','se1','r','t1','t2',3,2,'',1767225600000,'f','kraken hold on late.'),
 ('g2','se1','r','t2','t3',4,1,'',1767312000000,'f',null),
 ('g3','se1','r','t3','t1',2,3,'o',1767398400000,'f',null),
 ('g4','se1','r','t4','t1',0,0,'',1893456000000,'s',null);
insert into gs (i, gi, pi, ti, gl, a, pm, pim, sog, hit, blk, toi, fow, fol) values
 ('s1','g1','p1','t1',1,2,1,2,4,3,1,1104,5,4),
 ('s2','g1','p2','t1',0,1,1,0,2,1,0,900,0,0),
 ('s3','g1','p3','t2',1,0,-1,0,3,2,1,1020,3,6),
 ('s4','g3','p1','t1',2,0,2,0,6,1,0,1150,8,5);
insert into gs (i, gi, pi, ti, sv, ga, sa, so, r, toi) values
 ('s5','g1','p4','t2',30,3,33,0,'l',3600);
insert into at (i, p, d, v, no) values
 ('a1','p1',1764547200000,'{"sk":78,"sh":74,"pa":80,"ck":66,"df":72,"en":81}','draft'),
 ('a2','p1',1767225600000,'{"sk":80,"sh":77,"pa":82,"ck":66,"df":74,"en":82}','season 1 progression');
insert into aw (i, p, n, s, ty, d) values ('w1','p1','rookie of the month','se1','a',1767225600000);
