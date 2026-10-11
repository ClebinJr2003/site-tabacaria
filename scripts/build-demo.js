const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),dest=path.join(root,'public');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
for(const item of ['index.html','favicon.ico','css','js','images','assets']){
 const src=path.join(root,item);if(fs.existsSync(src))fs.cpSync(src,path.join(dest,item),{recursive:true});
}
// A demonstração é apenas uma vitrine estática; nenhum dado privado é publicado.
console.log('Demonstração estática criada em public/');
