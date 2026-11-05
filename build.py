"""Build the per-style-profile bundles in dist/. Run: python build.py  (needs Node + esbuild)."""
import subprocess, os
BUNDLES = {
  'retal-broker':           (['BrokerRegistration_Theme.css','BR_radioButtonCard.css','BR_Input.css','BR_InternalOpsPortal.css','List_and_card_Ops.css'],
                             ['BR_LandingScript.js','BR_InternalOpsPortal.js']),
  'retal-customer-journey': (['Global.css','GenericStyle.css','CustomList.css','Card.css','AddCustomer.css','CustomerLeadDetails.css'],
                             ['Card.js','CustomerLeadDetails.js']),
  'retal-brochure':         (['BroucherForm.css'], ['BroucherForm.js']),
}
CORE_CSS = ['src/00-retal-tokens.css','src/01-retal-base.css','src/02-retal-rtl.css','src/03-retal-k2-variables.css']
os.makedirs('dist', exist_ok=True)
for name,(css,js) in BUNDLES.items():
    open(f'dist/{name}.css','w',encoding='utf-8').write('\n'.join(open(p,encoding='utf-8').read() for p in CORE_CSS+['src/modules/'+f for f in css]))
    open(f'dist/{name}.js','w',encoding='utf-8').write('\n;\n'.join(open(p,encoding='utf-8').read() for p in ['src/retal-runtime.js']+['src/modules/'+f for f in js]))
    for ext in ('css','js'):
        subprocess.run(['npx','esbuild',f'dist/{name}.{ext}','--minify','--target=chrome110,safari16,firefox115',f'--outfile=dist/{name}.min.{ext}','--log-level=warning'],check=True)
    print(name, os.path.getsize(f'dist/{name}.min.css')//1024,'KB css,', os.path.getsize(f'dist/{name}.min.js')//1024,'KB js')
