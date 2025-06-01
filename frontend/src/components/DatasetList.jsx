// src/components/DatasetList.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaImage, FaAlignLeft, FaVolumeUp, FaPlayCircle, FaTable, FaHeart, FaDownload,FaEye } from "react-icons/fa";
import "./DatasetList.css";
// 🔒 API setup (commenté pour design statique)
// const [datasetList, setDatasetList] = useState([]);
// const fetchDatasets = () => {
//   fetch('http://localhost:8000/api/datasets/')
//     .then((response) => response.json())
//     .then((data) => setDatasetList(data))
//     .catch((error) => console.error('Error fetching datasets:', error));
// };

// useEffect(() => {
//   fetchDatasets();
//   const interval = setInterval(() => fetchDatasets(), 3000);
//   return () => clearInterval(interval);
// }, []);

export default function DatasetList() {
  // const navigate = useNavigate();
  const [liked, setLiked] = useState({});

 const staticDatasets = [
  {
    datasetId: '4',
    title: 'Survey Results',
    type: 'tabular',
    uploadedBy: 'UserB',
    uploadDate: '2023-11-01',
    size: '124 MB',
    likes: 87,
    downloads: 400,
    views: 199,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi et velit vestibulum fermentum. Sed dictum elit ut varius consectetur. Nulla nisl quam, consequat at porta at, gravida et enim. Nunc semper tortor vel ullamcorper imperdiet. Etiam imperdiet.e owiej poiwejfp iwoejf poiewfjpwoeljfcpwoifj [wolf w[po . ioej fwpoeif woiefj powijf oiwjaoiwjef pioawjfpoijw efijwpi w wefjoi wweoijfwoief jiwoefjpwifmwif jwoiefjpwoeif jpweoifjwpef 093r[wof woeifjp wifj oiefj oeiwjfp weoifj wpaoeif weoi fjepwoiajfpowiefnjk ewn pfowiefna wjoeif aweoifnapw ejkfn pwoiefnjwepiofnapweiufhpawioeufnawejufphawueiopawieuf',
    tags: ['#Survey', '#CSV'],
    metadata: {
      numberOfFiles: 2,
      totalSize: '302MB',
      formats: ['csv']
    },
    previewTables: [
      {
        columns: ['Name', 'Age', 'Country'],
        rows: [
          ['Alice', 28, 'Germany'],
          ['Bob', 34, 'France'],
          ['Charlie', 41, 'Spain'],
          ['Diana', 23, 'Italy']
        ]
      },
      {
        columns: ['Product', 'Category', 'Stock'],
        rows: [
          ['Laptop', 'Electronics', 20],
          ['Notebook', 'Stationery', 150],
          ['Pen', 'Stationery', 300]
        ]
      },
      {
        columns: ['Survey ID', 'Score', 'Status'],
        rows: [
          ['S001', 85, 'Completed'],
          ['S002', 90, 'Pending'],
          ['S003', 70, 'Completed']
        ]
      },
      {
        columns: ['Department', 'Employees', 'Budget'],
        rows: [
          ['HR', 15, '€200K'],
          ['IT', 25, '€500K'],
          ['Finance', 10, '€300K']
        ]
      }
    ],
    tableInfo: {
      columns: 3,
      rows: 4000,
      size: '124MB',
      format: 'csv',
      structure: [
        { type: 'String', count: 100 },
        { type: 'Integer', count: 20 },
        { type: 'Float', count: 50 }
      ]
    },
    completeness: {
      filled: 10,
      missing: 90,
    }
  },
  {
    datasetId: '1',
    title: 'Historical Decrees - 19th Century',
    type: 'text',
    uploadedBy: 'Archivist42',
    uploadDate: '2025-05-10',
    size: '212 MB',
    likes: 145,
    downloads: 320,
    views: 512,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi et velit vestibulum fermentum. Sed dictum elit ut varius consectetur. Nulla nisl quam, consequat at porta at, gravida et enim. Nunc semper tortor vel ullamcorper imperdiet. Etiam imperdiet.e owiej poiwejfp iwoejf poiewfjpwoeljfcpwoifj [wolf w[po . ioej fwpoeif woiefj powijf oiwjaoiwjef pioawjfpoijw efijwpi w wefjoi wweoijfwoief jiwoefjpwifmwif jwoiefjpwoeif jpweoifjwpef 093r[wof woeifjp wifj oiefj oeiwjfp weoifj wpaoeif weoi fjepwoiajfpowiefnjk ewn pfowiefna wjoeif aweoifnapw ejkfn pwoiefnjwepiofnapweiufhpawioeufnawejufphawueiopawieuf',
    tags: ['#History', '#LegalText', '#NLP'],
    metadata: {
      numberOfFiles: 4,
      totalSize: '212MB',
      formats: ['txt', 'pdf']
    },
    previewTexts: [
      `Text n°1 :\Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat metus a turpis ultrices vulputate. Ut eu arcu eget purus iaculis porttitor. Proin a accumsan est. Aliquam non aliquet massa. Praesent sit amet dolor orci. Sed eget convallis nisi. Proin eu lectus placerat, vulputate ligula eget, placerat diam. Curabitur luctus, sapien quis maximus tristique, erat felis aliquam quam, at dictum tellus diam ac dui. Curabitur porta, urna ut tristique hendrerit, est tortor interdum tellus, ac pharetra urna orci interdum turpis. Integer nec rutrum odio. Ut sem sem, faucibus luctus finibus nec, fermentum sed leo. Quisque iaculis nisl ante, nec hendrerit mauris porta at. Proin viverra urna mauris, vitae ultricies leo pretium id. Aliquam erat volutpat. Aliquam imperdiet ante dignissim elit facilisis, sed scelerisque enim dignissim. Donec quis libero dapibus justo vestibulum aliquet.

Aenean nec vulputate augue. Curabitur in magna pretium, rhoncus felis quis, tristique nulla. Pellentesque sed leo placerat, consectetur mi sed, condimentum massa. Duis bibendum elit vel arcu rhoncus facilisis. Aenean bibendum non enim eget elementum. Nullam a eros id mauris placerat mollis sit amet sit amet turpis. Vivamus iaculis pellentesque maximus. Integer tempor erat eget risus vulputate fermentum. Sed tellus tortor, tincidunt et dictum vel, lobortis et leo. Duis pharetra nunc quis metus consequat feugiat vel id est. Mauris sed enim sodales, tristique lectus non, hendrerit nisi. Etiam bibendum, elit sed dignissim interdum, ante nulla interdum ex, a vestibulum velit augue sed est. Donec eleifend est eget sem dignissim, sed mollis diam elementum. Nullam ut tellus fringilla, malesuada lectus a, tincidunt augue. Nullam turpis purus, egestas eget leo vitae, mattis cursus magna. Donec vehicula sed purus et consectetur.`,
    
      `Text n°2 :\nConsidérant les circonstances exceptionnelles... Article 1 — Il est institué un Conseil de Sûreté Nationale chargé de veiller à la sécurité intérieure. Article 2 — Le conseil rend compte directement au président.`,
    
      `Text n°3 :\nArticle 1 — Il est créé une commission d'examen sur les conflits miniers du Nord. Article 2 — La commission remettra son rapport dans un délai de 3 mois.`,
    
      `Text n°4 :\nArticle 1 — Le droit de grève est reconnu et protégé. Article 2 — Aucune sanction ne peut être prise contre un agent en raison de sa participation à une grève licite.`,
    ]
  },
  
  {
    datasetId: '2',
    title: 'Multimedia Collection 2023',
    type: 'image',
    uploadedBy: 'UserX',
    uploadDate: '2024-05-30',
    size: '302MB',
    likes: 150,
    downloads: 122,
    views: 378,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi et velit vestibulum fermentum. Sed dictum elit ut varius consectetur. Nulla nisl quam, consequat at porta at, gravida et enim. Nunc semper tortor vel ullamcorper imperdiet. Etiam imperdiet.e owiej poiwejfp iwoejf poiewfjpwoeljfcpwoifj [wolf w[po . ioej fwpoeif woiefj powijf oiwjaoiwjef pioawjfpoijw efijwpi w wefjoi wweoijfwoief jiwoefjpwifmwif jwoiefjpwoeif jpweoifjwpef 093r[wof woeifjp wifj oiefj oeiwjfp weoifj wpaoeif weoi fjepwoiajfpowiefnjk ewn pfowiefna wjoeif aweoifnapw ejkfn pwoiefnjwepiofnapweiufhpawioeufnawejufphawueiopawieuf',
    tags: ['#Tag', '#Another Tag', '#Multimedia'],
    metadata: {
      numberOfFiles: 230,
      totalSize: '302MB',
      formats: ['jpeg', 'png']
    },
    previewMedia: [
      {
        type: 'image',
        name: 'image_001.jpg',
        url: 'https://via.placeholder.com/150'
      },
      {
        type: 'image',
        name: 'image_002.jpg',
        url: 'https://via.placeholder.com/150'
      },
      {
        type: 'video',
        name: 'video_001.mp4',
        url: 'https://via.placeholder.com/150'
      },
      {
        type: 'video',
        name: 'video_002.mp4',
        url: 'https://via.placeholder.com/150'
      }
    ],
  
  },


  {
  datasetId: '3',
  title: 'Podcast Episode Audio',
  type: 'audio',
  uploadedBy: 'UserA',
  uploadDate: '2025-06-17',
  size: '389 MB',
  likes: 93,
  downloads: 62,
  views: 126,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu mi et velit vestibulum fermentum. Sed dictum elit ut varius consectetur. Nulla nisl quam, consequat at porta at, gravida et enim. Nunc semper tortor vel ullamcorper imperdiet. Etiam imperdiet.e owiej poiwejfp iwoejf poiewfjpwoeljfcpwoifj [wolf w[po . ioej fwpoeif woiefj powijf oiwjaoiwjef pioawjfpoijw efijwpi w wefjoi wweoijfwoief jiwoefjpwifmwif jwoiefjpwoeif jpweoifjwpef 093r[wof woeifjp wifj oiefj oeiwjfp weoifj wpaoeif weoi fjepwoiajfpowiefnjk ewn pfowiefna wjoeif aweoifnapw ejkfn pwoiefnjwepiofnapweiufhpawioeufnawejufphawueiopawieuf',
  tags: ['#Podcast', '#TechTalk', '#Culture'],
  metadata: {
    numberOfFiles: 12,
    formats: ['mp3', 'wav']
  },
  previewMedia: [
    {
      type: 'audio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      name: 'SoundHelix-Song-1.mp3',
      duration: '4:32'
    },
    {
      type: 'audio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      name: 'SoundHelix-Song-2.mp3',
      duration: '4:32'
    }
  ]
},


  
];
  const toggleLike = (datasetId) => {
    setLiked((prev) => ({
      ...prev,
      [datasetId]: !prev[datasetId],
    }));
  };

  const getIcon = (type) => {
    switch (type) {
      case "text":
        return <FaAlignLeft />;
      case "image":
        return <FaImage />;
      case "audio":
        return <FaVolumeUp />;
      case "video":
        return <FaPlayCircle />;
      case "tabular":
        return <FaTable />;
      default:
        return null;
    }
  };

  return (
    <section className="dataset-list-section">
      <h2>Datasets</h2>
      <div className="dataset-list">
        {staticDatasets.map((ds) => (
          <Link
            to={"/detailpages/" + ds.datasetId}
            key={ds.datasetId}
            className="dataset-card"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <div className="dataset-row">
              <div className="dataset-title-icon">
                {getIcon(ds.type)}
                <h3 className="dataset-title">{ds.title}</h3>
              </div>
              <div className="dataset-meta">
                <span>{ds.size}</span>
                <span>
                  Uploaded {new Date(ds.uploadDate).toLocaleDateString()}
                </span>
                <span
                  className="icon-meta"
                  onClick={() => toggleLike(ds.datasetId)}
                >
                  <FaHeart className={liked[ds.datasetId] ? "liked" : ""} />{" "}
                  {ds.likes + (liked[ds.datasetId] ? 1 : 0)}
                </span>
                <span className="icon-meta">
                  <FaDownload /> {ds.downloads}
                </span>
                <span className="icon-meta">
                  <FaEye /> {ds.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
