import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js';
import formRoutes from './routes/formRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

loadEnv();
await connectDB();

const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : '*',
	credentials: false
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public capture.js
app.get('/capture.js', (req, res) => {
	res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
	const script = `
(()=>{
  const findScriptBase=()=>{try{const scripts=[...document.getElementsByTagName('script')];const s=scripts.find(x=>x.src&&x.src.includes('/capture.js'));if(!s) return location.origin;const u=new URL(s.src);return u.origin}catch{return location.origin}};
  const BASE=findScriptBase();
  const serializeForm=(form)=>{
    const data={};
    const els=form.querySelectorAll('input,textarea,select');
    els.forEach(el=>{
      const key=el.name||el.getAttribute('data-name')||el.id;
      if(!key) return;
      if(el.type==='checkbox'){data[key]=el.checked}
      else if(el.type==='radio'){if(el.checked) data[key]=el.value}
      else if(el.tagName.toLowerCase()==='select' && el.multiple){data[key]=[...el.selectedOptions].map(o=>o.value)}
      else{data[key]=el.value}
    });
    return data;
  };
  const sendLead=(formId,payload)=>{
    try{
      const url=BASE+'/api/leads/'+encodeURIComponent(formId);
      const json=JSON.stringify(payload);
      if(navigator.sendBeacon){
        const blob=new Blob([json],{type:'application/json'});
        navigator.sendBeacon(url, blob);
      }else{
        fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:json,keepalive:true}).catch(()=>{});
      }
    }catch(e){}
  };
  // Expose manual API for non-form submits
  window.LTM_SEND_LEAD=(formId,data)=>{
    const payload={data,href:location.href,userAgent:navigator.userAgent,submittedAt:new Date().toISOString()};
    sendLead(formId,payload);
  };
  const getTargetForms=()=>{
    const withAttr=[...document.querySelectorAll('form[data-ltm-form]')];
    if(window.LTM_FORM_ID){
      const all=[...document.querySelectorAll('form')];
      if(all.length>0 && !withAttr.some(f=>f===all[0])){
        all[0].setAttribute('data-ltm-form', String(window.LTM_FORM_ID));
        withAttr.unshift(all[0]);
      }
    }
    return withAttr;
  };
  const attach=()=>{
    getTargetForms().forEach(form=>{
      if(form.__ltmAttached) return;
      form.__ltmAttached=true;
      form.addEventListener('submit',()=>{
        try{
          const formId=form.getAttribute('data-ltm-form'); if(!formId) return;
          const data=serializeForm(form);
          const payload={data,href:location.href,userAgent:navigator.userAgent,submittedAt:new Date().toISOString()};
          sendLead(formId,payload);
        }catch{}
      });
    });
  };
  attach();
  const obs=new MutationObserver(()=>attach());
  obs.observe(document.documentElement,{subtree:true,childList:true});
})();
`;
	res.send(script);
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({
		message: err.message || 'Server error',
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on port ${PORT}`);
});



