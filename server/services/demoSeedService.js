import { products } from '../models/ProductModel.js';
/* Explicitly fictitious QA fixtures. Never import into the public UI or present as real stock/fitment. */
import { getDb } from '../config/db.js';
import { formatSize } from './catalogService.js';

const fixtures = [
  ['City Touring A','Goodyear','Car',185,65,15,4299,9,'TireTread'],
  ['City Touring B','CEAT','Car',195,55,16,4799,5,'TireStacks'],
  ['City Touring C','MRF','Car',205,55,16,5699,7,'TireTread'],
  ['City Touring D','Yokohama','Car',215,55,17,6999,0,'ConfidenceWheel'],
  ['All-road Grip A','Continental','SUV',215,60,17,7899,4,'TireStacks'],
  ['All-road Grip B','MRF','SUV',235,65,17,8999,2,'TireTread'],
  ['All-road Grip C','Goodyear','SUV',245,60,18,10499,6,'ConfidenceWheel'],
  ['All-road Grip D','CEAT','SUV',265,65,17,11299,0,'TireStacks'],
  ['Scooter Street A','CEAT','Bike',90,90,12,1799,12,'MotorcycleWheel'],
  ['Scooter Street B','MRF','Bike',100,90,10,1699,3,'MotorcycleWheel'],
  ['Road Rider A','Yokohama','Bike',100,80,17,2499,1,'MotorcycleWheel'],
  ['Road Rider B','Goodyear','Bike',120,80,18,2999,0,'MotorcycleWheel'],
  ['Carrier Radial A','JK Tyre','Commercial',215,75,17,11999,8,'CommercialTruck'],
  ['Carrier Radial B','CEAT','Commercial',235,75,17,13999,5,'CommercialTruck'],
  ['Carrier Radial C','MRF','Commercial',295,80,22,22999,0,'CommercialTruck'],
  ['Carrier Radial D','Continental','Commercial',275,70,22,20999,4,'CommercialTruck'],
];
export async function seedDemoProducts() {
  const db = await getDb(); let inserted = 0;
  for (const [label,brand,category,width,aspectRatio,rimDiameter,price,stockQty,image] of fixtures) {
    const tyre = { width,aspectRatio,rimDiameter,loadIndex:'',speedRating:'',type:category === 'Bike' ? 'Tubeless' : 'Radial tubeless' };
    tyre.size = formatSize(tyre);
    const code = label.replace(/[^a-z0-9]/gi,'-').replace(/-+/g,'-').toUpperCase();
    const sku = `DEMO-${code}-${width}${aspectRatio}R${rimDiameter}`;
    const record = { name:`DEMO · ${label} ${tyre.size}`,slug:`demo-${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${width}-${aspectRatio}-r${rimDiameter}`,
      sku,brand,category,description:'Fictitious example for testing catalogue search, filters, stock handling, requests and demo payments. Not actual J.M. Tyres inventory, a manufacturer model, a quoted selling price or a fitment recommendation.',
      pricePaise:price*100,stockQty,images:[{url:`/demo/${image}.jpg`,alt:'Illustrative category image, not a photograph of this sample product'}],
      tyre,compatibility:[],active:true,isDemo:true,featured:['City Touring A','All-road Grip A','Scooter Street A','Carrier Radial A'].includes(label),
      lowStockAlerted:stockQty < 5 && stockQty > 0,lowStockCycle:0,createdAt:new Date(),updatedAt:new Date() };
    const result = await products(db).updateOne({sku},{$setOnInsert:record},{upsert:true});
    if (result.upsertedCount) inserted++;
  }
  return {inserted,totalFixtures:fixtures.length,message:'All 16 products are labelled DEMO; prices, stock and images are examples. Vehicle compatibility is intentionally empty until verified entries are added.'};
}
