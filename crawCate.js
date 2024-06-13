const cheerio = require("cheerio");
const db = require("./utils/database");
const { v4: uuidv4 } = require("uuid");

async function fetchDataFromPage() {
  const htmlContent = `
<ul class="sub-menu">
<li><a class="navbar-menu-item" href="/the-loai/3d-hentai/"> 3D Hentai</a></li>
<li><a class="navbar-menu-item" href="/the-loai/action/"> Action</a></li>
<li><a class="navbar-menu-item" href="/the-loai/adult/"> Adult</a></li>
<li><a class="navbar-menu-item" href="/the-loai/ahegao/"> Ahegao</a></li>
<li><a class="navbar-menu-item" href="/the-loai/anal/"> Anal</a></li>
<li><a class="navbar-menu-item" href="/the-loai/animal/"> Animal</a></li>
<li><a class="navbar-menu-item" href="/the-loai/artist-cg/"> Artist CG</a></li>
<li><a class="navbar-menu-item" href="/the-loai/bao-dam/"> Bạo Dâm</a></li>
<li><a class="navbar-menu-item" href="/the-loai/bdsm/"> BDSM</a></li>
<li><a class="navbar-menu-item" href="/the-loai/big-ass/"> Big Ass</a></li>
<li><a class="navbar-menu-item" href="/the-loai/big-boobs/"> Big Boobs</a></li>
<li><a class="navbar-menu-item" href="/the-loai/big-penis/"> Big Penis</a></li>
<li><a class="navbar-menu-item" href="/the-loai/blowjobs/"> BlowJobs</a></li>
<li><a class="navbar-menu-item" href="/the-loai/body-swap/"> Body Swap</a></li>
<li><a class="navbar-menu-item" href="/the-loai/bodysuit/"> Bodysuit</a></li>
<li><a class="navbar-menu-item" href="/the-loai/bondage/"> Bondage</a></li>
<li><a class="navbar-menu-item" href="/the-loai/breast-sucking/"> Breast Sucking</a></li>
<li><a class="navbar-menu-item" href="/the-loai/breastjobs/"> BreastJobs</a></li>
<li><a class="navbar-menu-item" href="/the-loai/che-it/"> Che ít</a></li>
<li><a class="navbar-menu-item" href="/the-loai/che-nhieu/"> Che nhiều</a></li>
<li><a class="navbar-menu-item" href="/the-loai/cheating/"> Cheating</a></li>
<li><a class="navbar-menu-item" href="/the-loai/co-che/"> Có Che</a></li>
<li><a class="navbar-menu-item" href="/the-loai/comedy/"> Comedy</a></li>
<li><a class="navbar-menu-item" href="/the-loai/cosplay/"> Cosplay</a></li>
<li><a class="navbar-menu-item" href="/the-loai/dark-skin/"> Dark Skin</a></li>
<li><a class="navbar-menu-item" href="/the-loai/demon/"> Demon</a></li>
<li><a class="navbar-menu-item" href="/the-loai/dirty-old-man/"> Dirty Old Man</a></li>
<li><a class="navbar-menu-item" href="/the-loai/doujinshi/"> Doujinshi</a></li>
<li><a class="navbar-menu-item" href="/the-loai/drama/"> Drama</a></li>
<li><a class="navbar-menu-item" href="/the-loai/ecchi/"> Ecchi</a></li>
<li><a class="navbar-menu-item" href="/the-loai/elf/"> Elf</a></li>
<li><a class="navbar-menu-item" href="/the-loai/exhibitionism/"> Exhibitionism</a></li>
<li><a class="navbar-menu-item" href="/the-loai/femdom/"> Femdom</a></li>
<li><a class="navbar-menu-item" href="/the-loai/footjob/"> Footjob</a></li>
<li><a class="navbar-menu-item" href="/the-loai/full-color/"> Full Color</a></li>
<li><a class="navbar-menu-item" href="/the-loai/furry/"> Furry</a></li>
<li><a class="navbar-menu-item" href="/the-loai/futanari/"> Futanari</a></li>
<li><a class="navbar-menu-item" href="/the-loai/game/"> Game</a></li>
<li><a class="navbar-menu-item" href="/the-loai/gender-bender/"> Gender Bender</a></li>
<li><a class="navbar-menu-item" href="/the-loai/gothic-lolita/"> Gothic Lolita</a></li>
<li><a class="navbar-menu-item" href="/the-loai/granblue-fantasy/"> Granblue Fantasy</a></li>
<li><a class="navbar-menu-item" href="/the-loai/group/"> Group</a></li>
<li><a class="navbar-menu-item" href="/the-loai/guro/"> Guro</a></li>
<li><a class="navbar-menu-item" href="/the-loai/hand-job/"> Hand Job</a></li>
<li><a class="navbar-menu-item" href="/the-loai/harem/"> Harem</a></li>
<li><a class="navbar-menu-item" href="/the-loai/hentaivn/"> HentaiVN</a></li>
<li><a class="navbar-menu-item" href="/the-loai/historical/"> Historical</a></li>
<li><a class="navbar-menu-item" href="/the-loai/horror/"> Horror</a></li>
<li><a class="navbar-menu-item" href="/the-loai/housewife/"> Housewife</a></li>
<li><a class="navbar-menu-item" href="/the-loai/insect-con-trung/"> Insect (Côn Trùng)</a></li>
<li><a class="navbar-menu-item" href="/the-loai/khong-che/"> Không Che</a></li>
<li><a class="navbar-menu-item" href="/the-loai/loan-luan/"> Loạn Luân</a></li>
<li><a class="navbar-menu-item" href="/the-loai/loli/"> Loli</a></li>
<li><a class="navbar-menu-item" href="/the-loai/maids/"> Maids</a></li>
<li><a class="navbar-menu-item" href="/the-loai/manhwa/"> Manhwa</a></li>
<li><a class="navbar-menu-item" href="/the-loai/masturbation/"> Masturbation</a></li>
<li><a class="navbar-menu-item" href="/the-loai/milf/"> Milf</a></li>
<li><a class="navbar-menu-item" href="/the-loai/mind-control/"> Mind Control</a></li>
<li><a class="navbar-menu-item" href="/the-loai/monster/"> Monster</a></li>
<li><a class="navbar-menu-item" href="/the-loai/mother/"> Mother</a></li>
<li><a class="navbar-menu-item" href="/the-loai/ntr/"> NTR</a></li>
<li><a class="navbar-menu-item" href="/the-loai/nurse/"> Nurse</a></li>
<li><a class="navbar-menu-item" href="/the-loai/old-man/"> Old Man</a></li>
<li><a class="navbar-menu-item" href="/the-loai/oneshot/"> Oneshot</a></li>
<li><a class="navbar-menu-item" href="/the-loai/osananajimi/"> Osananajimi</a></li>
<li><a class="navbar-menu-item" href="/the-loai/pantyhose/"> Pantyhose</a></li>
<li><a class="navbar-menu-item" href="/the-loai/pregnant/"> Pregnant</a></li>
<li><a class="navbar-menu-item" href="/the-loai/rape/"> Rape</a></li>
<li><a class="navbar-menu-item" href="/the-loai/romance/"> Romance</a></li>
<li><a class="navbar-menu-item" href="/the-loai/scat/"> Scat</a></li>
<li><a class="navbar-menu-item" href="/the-loai/school-uniform/"> School Uniform</a></li>
<li><a class="navbar-menu-item" href="/the-loai/schoolgirl/"> SchoolGirl</a></li>
<li><a class="navbar-menu-item" href="/the-loai/series/"> Series</a></li>
<li><a class="navbar-menu-item" href="/the-loai/sex-toys/"> Sex Toys</a></li>
<li><a class="navbar-menu-item" href="/the-loai/shota/"> Shota</a></li>
<li><a class="navbar-menu-item" href="/the-loai/sister/"> Sister</a></li>
<li><a class="navbar-menu-item" href="/the-loai/slave/"> Slave</a></li>
<li><a class="navbar-menu-item" href="/the-loai/sleeping/"> Sleeping</a></li>
<li><a class="navbar-menu-item" href="/the-loai/small-boobs/"> Small Boobs</a></li>
<li><a class="navbar-menu-item" href="/the-loai/sports/"> Sports</a></li>
<li><a class="navbar-menu-item" href="/the-loai/stockings/"> Stockings</a></li>
<li><a class="navbar-menu-item" href="/the-loai/teacher/"> Teacher</a></li>
<li><a class="navbar-menu-item" href="/the-loai/tentacles/"> Tentacles</a></li>
<li><a class="navbar-menu-item" href="/the-loai/tomboy/"> Tomboy</a></li>
<li><a class="navbar-menu-item" href="/the-loai/trap/"> Trap</a></li>
<li><a class="navbar-menu-item" href="/the-loai/truyen-tranh-18/"> Truyện tranh 18+</a></li>
<li><a class="navbar-menu-item" href="/the-loai/vampire/"> Vampire</a></li>
<li><a class="navbar-menu-item" href="/the-loai/webtoon/"> Webtoon</a></li>
<li><a class="navbar-menu-item" href="/the-loai/x-ray/"> X-ray</a></li>
<li><a class="navbar-menu-item" href="/the-loai/yandere/"> Yandere</a></li>
<li><a class="navbar-menu-item" href="/the-loai/yaoi/"> Yaoi</a></li>
<li><a class="navbar-menu-item" href="/the-loai/yuri/"> Yuri</a></li>
</ul>
`;

  const $ = cheerio.load(htmlContent);

  // Find all <a> tags within the <ul> with class 'sub-menu'
  const aTags = $("ul.sub-menu a");
  // Extract and log the text content and href attribute for each <a> tag
  aTags.each(async (index, element) => {
    const uuid = uuidv4();

    const creatAT = {
      id: 1,
      time: Date.now(),
    };
    const textContent = $(element).text().trim();
    const hrefAttribute = $(element).attr("href");
    const finalHref = hrefAttribute?.replace("/the-loai/", "")?.replace("/", "");
    const connection = await db.getConnection();
    const [data] = await connection.query(`INSERT INTO noah_cateogires (uuid, name, slug, creatAT) VALUES (?, ?, ?, ?)`, [uuid, textContent, finalHref, JSON.stringify(creatAT)]);
    connection.release();
  });
}
fetchDataFromPage();
