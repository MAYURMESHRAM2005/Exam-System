import{g as ro,a as is}from"./index-aSKmBLHB.js";function so(t,e){for(var n=0;n<e.length;n++){const r=e[n];if(typeof r!="string"&&!Array.isArray(r)){for(const s in r)if(s!=="default"&&!(s in t)){const a=Object.getOwnPropertyDescriptor(r,s);a&&Object.defineProperty(t,s,a.get?a:{enumerable:!0,get:()=>r[s]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}var Xt={exports:{}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fp=1e-7,Cp=1e-4;class Rp{constructor(e,n){this.backend=e,this.dataMover=n,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,n){this.dataIdsCount++,this.data.set(e,n)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}}class ao{refCount(e){return be("refCount")}incRef(e){return be("incRef")}timerAvailable(){return!0}time(e){return be("time")}read(e){return be("read")}readSync(e){return be("readSync")}readToGPU(e,n){return be("readToGPU")}numDataIds(){return be("numDataIds")}disposeData(e,n){return be("disposeData")}write(e,n,r){return be("write")}move(e,n,r,s,a){return be("move")}createTensorFromGPUData(e,n,r){return be("createTensorFromGPUData")}memory(){return be("memory")}floatPrecision(){return be("floatPrecision")}epsilon(){return this.floatPrecision()===32?Fp:Cp}dispose(){return be("dispose")}}function be(t){throw new Error(`'${t}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function oo(t){let e=t.length,n=0;for(;e>0;)n=Math.random()*e|0,e--,Wn(t,e,n)}function Pp(t,e){if(t.length!==e.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${t.length}Second array length was ${e.length}`);let n=t.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,Wn(t,n,r),Wn(e,n,r)}function en(t,e,n){return Math.max(t,Math.min(e,n))}function Lp(t){return t%2===0?t:t+1}function Wn(t,e,n){const r=t[e];t[e]=t[n],t[n]=r}function Bp(t){let e=0;for(let n=0;n<t.length;n++)e+=t[n];return e}function zp(t,e){const n=Math.random();return e*n+(1-n)*t}function Vp(t,e){let n=0;for(let r=0;r<t.length;r++){const s=Number(t[r])-Number(e[r]);n+=s*s}return n}function g(t,e){if(!t)throw new Error(typeof e=="string"?e:e())}function ge(t,e,n=""){g(Ce(t,e),()=>n+` Shapes ${t} and ${e} must match`)}function It(t){g(t!=null,()=>"The input to the tensor constructor must be a non-null value.")}function G(t){if(t.length===0)return 1;let e=t[0];for(let n=1;n<t.length;n++)e*=t[n];return e}function jp(t){return t.length===0}function io(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==null&&e[n]!==null&&t[n]!==e[n])return!1;return!0}function Ce(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function Rt(t){return t%1===0}function Mp(t){if(Math.tanh!=null)return Math.tanh(t);if(t===1/0)return 1;if(t===-1/0)return-1;{const e=Math.exp(2*t);return(e-1)/(e+1)}}function Wp(t){const e=Math.ceil(Math.sqrt(t));return[e,Math.ceil(t/e)]}function qp(t){const e=new Uint32Array(t);for(let n=0;n<t;++n)e[n]=n;return oo(e),e}function Yt(t,e){return e<=t.length?t:t+" ".repeat(e-t.length)}function Up(t,e=s=>0,n,r){return new Promise((s,a)=>{let o=0;const i=()=>{if(t()){s();return}o++;const u=e(o);if(n!=null&&o>=n){a();return}r!=null?r(i,u):setTimeout(i,u)};i()})}function Gp(t,e){let n=1,r=-1;for(let a=0;a<t.length;++a)if(t[a]>=0)n*=t[a];else if(t[a]===-1){if(r!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${a}`);r=a}else if(t[a]<0)throw Error(`Shapes can not be < 0. Found ${t[a]} at dim ${a}`);if(r===-1){if(e>0&&e!==n)throw Error(`Size(${e}) must match the product of shape ${t}`);return t}if(n===0)throw Error(`Cannot infer the missing size in [${t}] when there are 0 elements`);if(e%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${e} / ${n}`);const s=t.slice();return s[r]=e/n,s}function dn(t,e){const n=e.length;return t=t==null?e.map((r,s)=>s):[].concat(t),g(t.every(r=>r>=-n&&r<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${t}`),g(t.every(r=>Rt(r)),()=>`All values in axis param must be integers but got axis ${t}`),t.map(r=>r<0?n+r:r)}function uo(t,e){const n=[],r=[],s=e!=null&&Array.isArray(e)&&e.length===0,a=e==null||s?null:dn(e,t).sort();let o=0;for(let i=0;i<t.length;++i){if(a!=null){if(a[o]===i&&t[i]!==1)throw new Error(`Can't squeeze axis ${i} since its dim '${t[i]}' is not 1`);(a[o]==null||a[o]>i)&&t[i]===1&&(n.push(t[i]),r.push(i)),a[o]<=i&&o++}t[i]!==1&&(n.push(t[i]),r.push(i))}return{newShape:n,keptDims:r}}function lo(t,e){return us(t,e)}function us(t,e){let n=null;if(t==null||t==="float32")n=new Float32Array(e);else if(t==="int32")n=new Int32Array(e);else if(t==="bool")n=new Uint8Array(e);else if(t==="string")n=new Array(e);else throw new Error(`Unknown data type ${t}`);return n}function co(t,e){for(let n=0;n<t.length;n++){const r=t[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${e} being uploaded contains ${r}.`)}}function ho(t){return t==="bool"||t==="complex64"||t==="float32"||t==="int32"||t==="string"}function Hp(t,e){return!(e==="complex64"||e==="float32"&&t!=="complex64"||e==="int32"&&t!=="float32"&&t!=="complex64"||e==="bool"&&t==="bool")}function qn(t){if(t==="float32"||t==="int32")return 4;if(t==="complex64")return 8;if(t==="bool")return 1;throw new Error(`Unknown dtype ${t}`)}function po(t){if(t==null)return 0;let e=0;return t.forEach(n=>e+=n.length),e}function Qe(t){return typeof t=="string"||t instanceof String}function fo(t){return typeof t=="boolean"}function mo(t){return typeof t=="number"}function gn(t){return Array.isArray(t)?gn(t[0]):t instanceof Float32Array?"float32":t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray?"int32":mo(t)?"float32":Qe(t)?"string":fo(t)?"bool":"float32"}function rt(t){return!!(t&&t.constructor&&t.call&&t.apply)}function Un(t,e){for(let n=e;n<t;++n)if(t%n===0)return n;return t}function Wt(t){const e=t.length;if(e<2)return[];const n=new Array(e-1);n[e-2]=t[e-1];for(let r=e-3;r>=0;--r)n[r]=n[r+1]*t[r+1];return n}function go(t,e,n,r=!1){const s=new Array;if(e.length===1){const a=e[0]*(r?2:1);for(let o=0;o<a;o++)s[o]=n[t+o]}else{const a=e[0],o=e.slice(1),i=o.reduce((u,l)=>u*l)*(r?2:1);for(let u=0;u<a;u++)s[u]=go(t+u*i,o,n,r)}return s}function bt(t,e,n=!1){if(t.length===0)return e[0];const r=t.reduce((s,a)=>s*a)*(n?2:1);if(r===0)return[];if(r!==e.length)throw new Error(`[${t}] does not match the input size ${e.length}${n?" for a complex tensor":""}.`);return go(0,t,e,n)}function Kp(t,e){if(Array.isArray(t))return t;if(e==="float32")return t instanceof Float32Array?t:new Float32Array(t);if(e==="int32")return t instanceof Int32Array?t:new Int32Array(t);if(e==="bool"||e==="string")return Uint8Array.from(new Int32Array(t));throw new Error(`Unknown dtype ${e}`)}function ls(t,e){const n=rr(t,e);for(let r=0;r<n.length;r++)n[r]=1;return n}function rr(t,e){if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool")return new Uint8Array(t);throw new Error(`Unknown data type ${e}`)}function Xp(t,e){const n=t.reduce((r,s)=>r*s,1);if(e==null||e==="float32")return bt(t,new Float32Array(n));if(e==="int32")return bt(t,new Int32Array(n));if(e==="bool")return bt(t,new Uint8Array(n));throw new Error(`Unknown data type ${e}`)}function $e(t){t.forEach(e=>{g(Number.isInteger(e)&&e>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${t}].`)})}function Zp(t,e,n){if(e===0)return 0;if(e===1)return t[0];let r=t[t.length-1];for(let s=0;s<t.length-1;++s)r+=n[s]*t[s];return r}function Jp(t,e,n){if(e===0)return[];if(e===1)return[t];const r=new Array(e);for(let s=0;s<r.length-1;++s)r[s]=Math.floor(t/n[s]),t-=r[s]*n[s];return r[r.length-1]=t,r}function st(t){return t&&t.then&&typeof t.then=="function"}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ta="tfjsflags";class yo{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=Yp,this.populateURLFlags()}setPlatform(e,n){this.platform!=null&&(B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=n}registerFlag(e,n,r){if(this.flagRegistry[e]={evaluationFn:n,setHook:r},this.urlFlags[e]!=null){const s=this.urlFlags[e];B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${s}.`),this.set(e,s)}}async getAsync(e){return e in this.flags?this.flags[e]:(this.flags[e]=await this.evaluateFlag(e),this.flags[e])}get(e){if(e in this.flags)return this.flags[e];const n=this.evaluateFlag(e);if(st(n))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=n,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getString(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,n){if(this.flagRegistry[e]==null)throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=n,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(n)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const e=this.getQueryParams(this.global.location.search);Ta in e&&e[Ta].split(",").forEach(r=>{const[s,a]=r.split(":");this.urlFlags[s]=ef(s,a)})}}function Yp(t){const e={};return t.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...r)=>(Qp(e,r[0],r[1]),r.join("="))),e}function Qp(t,e,n){t[decodeURIComponent(e)]=decodeURIComponent(n||"")}function ef(t,e){const n=e.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:e}function B(){return cs}let cs=null;function tf(t){cs=t}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Sr;function bo(){if(Sr==null){let t;if(typeof window<"u")t=window;else if(typeof global<"u")t=global;else if(typeof process<"u")t=process;else if(typeof self<"u")t=self;else throw new Error("Could not find a global object");Sr=t}return Sr}function nf(){const t=bo();return t._tfGlobals==null&&(t._tfGlobals=new Map),t._tfGlobals}function hs(t,e){const n=nf();if(n.has(t))return n.get(t);{const r=e();return n.set(t,r),n.get(t)}}const wo="Abs",No="Acos",So="Acosh",ps="Add",To="AddN",$o="All",Eo="Any",ko="ArgMax",vo="ArgMin",_o="Asin",Io="Asinh",xo="Atan",Ao="Atanh",Oo="Atan2",Do="AvgPool",rf="AvgPoolGrad",Fo="AvgPool3D",sf="AvgPool3DGrad",Co="BatchMatMul",Ro="BatchToSpaceND",Po="Bincount",Lo="BitwiseAnd",af="BroadcastTo",Bo="BroadcastArgs",fs="Cast",zo="Ceil",Vo="ClipByValue",jo="Complex",Mo="ComplexAbs",Wo="Concat",qo="Conv2D",Uo="Conv2DBackpropFilter",Go="Conv2DBackpropInput",Ho="Conv3D",of="Conv3DBackpropFilterV2",Ko="Conv3DBackpropInputV2",Xo="Cos",Zo="Cosh",Jo="Cumprod",Yo="Cumsum",Qo="CropAndResize",ei="DenseBincount",ti="DepthToSpace",ni="DepthwiseConv2dNative",ri="DepthwiseConv2dNativeBackpropFilter",si="DepthwiseConv2dNativeBackpropInput",ai="Diag",oi="Dilation2D",uf="Dilation2DBackpropInput",lf="Dilation2DBackpropFilter",ms="Draw",ii="RealDiv",ui="Einsum",li="Elu",cf="EluGrad",ci="Erf",hi="Equal",pi="Exp",fi="ExpandDims",mi="Expm1",di="FFT",gi="Fill",yi="FlipLeftRight",bi="Floor",wi="FloorDiv",Ni="FusedBatchNorm",Si="GatherV2",Ti="GatherNd",$i="Greater",Ei="GreaterEqual",ds="Identity",ki="IFFT",vi="Imag",_i="IsFinite",Ii="IsInf",xi="IsNan",Ai="LeakyRelu",Oi="Less",Di="LessEqual",Fi="LinSpace",Ci="Log",Ri="Log1p",Pi="LogicalAnd",Li="LogicalNot",Bi="LogicalOr",hf="LogicalXor",pf="LogSoftmax",ff="LowerBound",zi="LRN",mf="LRNGrad",df="MatrixBandPart",Vi="Max",ji="Maximum",Mi="MaxPool",gf="MaxPoolGrad",Wi="MaxPool3D",yf="MaxPool3DGrad",qi="MaxPoolWithArgmax",Ui="Mean",Gi="Min",Hi="Minimum",Ki="MirrorPad",Xi="Mod",Zi="Multinomial",Ji="Multiply",Yi="Neg",Qi="NotEqual",eu="NonMaxSuppressionV3",tu="NonMaxSuppressionV4",nu="NonMaxSuppressionV5",ru="OnesLike",su="OneHot",au="Pack",ou="PadV2",bf="Pool",iu="Pow",uu="Prelu",lu="Prod",cu="RaggedGather",hu="RaggedRange",pu="RaggedTensorToTensor",fu="Range",mu="Real",du="Reciprocal",gu="Relu",yu="Reshape",bu="ResizeNearestNeighbor",wf="ResizeNearestNeighborGrad",wu="ResizeBilinear",Nf="ResizeBilinearGrad",Nu="Relu6",Su="Reverse",Tu="Round",$u="Rsqrt",Eu="ScatterNd",ku="TensorScatterUpdate",vu="SearchSorted",_u="Select",Iu="Selu",xu="Slice",Au="Sin",Ou="Sinh",Du="Sign",Fu="Sigmoid",Cu="Softplus",Ru="Sqrt",Pu="Sum",Lu="SpaceToBatchND",Bu="SplitV",zu="Softmax",Vu="SparseFillEmptyRows",ju="SparseReshape",Mu="SparseSegmentMean",Wu="SparseSegmentSum",qu="SparseToDense",Uu="SquaredDifference",Sf="Square",Gu="StaticRegexReplace",Hu="StridedSlice",Ku="StringNGrams",Xu="StringSplit",Zu="StringToHashBucketFast",Ju="Sub",Yu="Tan",Qu="Tanh",gs="Tile",el="TopK",tl="Transform",Dn="Transpose",nl="Unique",rl="Unpack",sl="UnsortedSegmentSum",Tf="UpperBound",al="ZerosLike",ol="Step",Ar="FromPixels",il="RotateWithOffset",Or="_FusedMatMul",Dr="FusedConv2D",Fr="FusedDepthwiseConv2D";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Je(...t){B().getBool("IS_TEST")||B().getBool("PROD")||console.warn(...t)}function $f(...t){B().getBool("IS_TEST")||B().getBool("PROD")||console.log(...t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Pt=hs("kernelRegistry",()=>new Map),tn=hs("gradRegistry",()=>new Map);function nn(t,e){const n=ys(t,e);return Pt.get(n)}function Cr(t){return tn.get(t)}function Gn(t){const e=Pt.entries(),n=[];for(;;){const{done:r,value:s}=e.next();if(r)break;const[a,o]=s,[i]=a.split("_");i===t&&n.push(o)}return n}function ul(t){const{kernelName:e,backendName:n}=t,r=ys(e,n);Pt.has(r)&&Je(`The kernel '${e}' for backend '${n}' is already registered`),Pt.set(r,t)}function Ef(t){const{kernelName:e}=t;tn.has(e)&&B().getBool("DEBUG")&&Je(`Overriding the gradient for '${e}'`),tn.set(e,t)}function kf(t,e){const n=ys(t,e);if(!Pt.has(n))throw new Error(`The kernel '${t}' for backend '${e}' is not registered`);Pt.delete(n)}function vf(t){if(!tn.has(t))throw new Error(`The gradient '${t}' for backend is not registered`);tn.delete(t)}function _f(t,e){Gn(t).forEach(r=>{const s=Object.assign({},r,{backendName:e});ul(s)})}function ys(t,e){return`${e}_${t}`}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ll(t){return t instanceof Float32Array||t instanceof Int32Array||t instanceof Uint8Array||t instanceof Uint8ClampedArray}var Tr,$a;function If(){if($a)return Tr;$a=1,Tr=e;var t=null;try{t=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function e(E,y,A){this.low=E|0,this.high=y|0,this.unsigned=!!A}e.prototype.__isLong__,Object.defineProperty(e.prototype,"__isLong__",{value:!0});function n(E){return(E&&E.__isLong__)===!0}e.isLong=n;var r={},s={};function a(E,y){var A,R,z;return y?(E>>>=0,(z=0<=E&&E<256)&&(R=s[E],R)?R:(A=i(E,(E|0)<0?-1:0,!0),z&&(s[E]=A),A)):(E|=0,(z=-128<=E&&E<128)&&(R=r[E],R)?R:(A=i(E,E<0?-1:0,!1),z&&(r[E]=A),A))}e.fromInt=a;function o(E,y){if(isNaN(E))return y?O:$;if(y){if(E<0)return O;if(E>=b)return P}else{if(E<=-T)return C;if(E+1>=T)return D}return E<0?o(-E,y).neg():i(E%m|0,E/m|0,y)}e.fromNumber=o;function i(E,y,A){return new e(E,y,A)}e.fromBits=i;var u=Math.pow;function l(E,y,A){if(E.length===0)throw Error("empty string");if(E==="NaN"||E==="Infinity"||E==="+Infinity"||E==="-Infinity")return $;if(typeof y=="number"?(A=y,y=!1):y=!!y,A=A||10,A<2||36<A)throw RangeError("radix");var R;if((R=E.indexOf("-"))>0)throw Error("interior hyphen");if(R===0)return l(E.substring(1),y,A).neg();for(var z=o(u(A,8)),V=$,W=0;W<E.length;W+=8){var Y=Math.min(8,E.length-W),ae=parseInt(E.substring(W,W+Y),A);if(Y<8){var te=o(u(A,Y));V=V.mul(te).add(o(ae))}else V=V.mul(z),V=V.add(o(ae))}return V.unsigned=y,V}e.fromString=l;function h(E,y){return typeof E=="number"?o(E,y):typeof E=="string"?l(E,y):i(E.low,E.high,typeof y=="boolean"?y:E.unsigned)}e.fromValue=h;var c=65536,f=1<<24,m=c*c,b=m*m,T=b/2,w=a(f),$=a(0);e.ZERO=$;var O=a(0,!0);e.UZERO=O;var v=a(1);e.ONE=v;var _=a(1,!0);e.UONE=_;var x=a(-1);e.NEG_ONE=x;var D=i(-1,2147483647,!1);e.MAX_VALUE=D;var P=i(-1,-1,!0);e.MAX_UNSIGNED_VALUE=P;var C=i(0,-2147483648,!1);e.MIN_VALUE=C;var k=e.prototype;return k.toInt=function(){return this.unsigned?this.low>>>0:this.low},k.toNumber=function(){return this.unsigned?(this.high>>>0)*m+(this.low>>>0):this.high*m+(this.low>>>0)},k.toString=function(y){if(y=y||10,y<2||36<y)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(C)){var A=o(y),R=this.div(A),z=R.mul(A).sub(this);return R.toString(y)+z.toInt().toString(y)}else return"-"+this.neg().toString(y);for(var V=o(u(y,6),this.unsigned),W=this,Y="";;){var ae=W.div(V),te=W.sub(ae.mul(V)).toInt()>>>0,re=te.toString(y);if(W=ae,W.isZero())return re+Y;for(;re.length<6;)re="0"+re;Y=""+re+Y}},k.getHighBits=function(){return this.high},k.getHighBitsUnsigned=function(){return this.high>>>0},k.getLowBits=function(){return this.low},k.getLowBitsUnsigned=function(){return this.low>>>0},k.getNumBitsAbs=function(){if(this.isNegative())return this.eq(C)?64:this.neg().getNumBitsAbs();for(var y=this.high!=0?this.high:this.low,A=31;A>0&&(y&1<<A)==0;A--);return this.high!=0?A+33:A+1},k.isZero=function(){return this.high===0&&this.low===0},k.eqz=k.isZero,k.isNegative=function(){return!this.unsigned&&this.high<0},k.isPositive=function(){return this.unsigned||this.high>=0},k.isOdd=function(){return(this.low&1)===1},k.isEven=function(){return(this.low&1)===0},k.equals=function(y){return n(y)||(y=h(y)),this.unsigned!==y.unsigned&&this.high>>>31===1&&y.high>>>31===1?!1:this.high===y.high&&this.low===y.low},k.eq=k.equals,k.notEquals=function(y){return!this.eq(y)},k.neq=k.notEquals,k.ne=k.notEquals,k.lessThan=function(y){return this.comp(y)<0},k.lt=k.lessThan,k.lessThanOrEqual=function(y){return this.comp(y)<=0},k.lte=k.lessThanOrEqual,k.le=k.lessThanOrEqual,k.greaterThan=function(y){return this.comp(y)>0},k.gt=k.greaterThan,k.greaterThanOrEqual=function(y){return this.comp(y)>=0},k.gte=k.greaterThanOrEqual,k.ge=k.greaterThanOrEqual,k.compare=function(y){if(n(y)||(y=h(y)),this.eq(y))return 0;var A=this.isNegative(),R=y.isNegative();return A&&!R?-1:!A&&R?1:this.unsigned?y.high>>>0>this.high>>>0||y.high===this.high&&y.low>>>0>this.low>>>0?-1:1:this.sub(y).isNegative()?-1:1},k.comp=k.compare,k.negate=function(){return!this.unsigned&&this.eq(C)?C:this.not().add(v)},k.neg=k.negate,k.add=function(y){n(y)||(y=h(y));var A=this.high>>>16,R=this.high&65535,z=this.low>>>16,V=this.low&65535,W=y.high>>>16,Y=y.high&65535,ae=y.low>>>16,te=y.low&65535,re=0,ve=0,ue=0,Ee=0;return Ee+=V+te,ue+=Ee>>>16,Ee&=65535,ue+=z+ae,ve+=ue>>>16,ue&=65535,ve+=R+Y,re+=ve>>>16,ve&=65535,re+=A+W,re&=65535,i(ue<<16|Ee,re<<16|ve,this.unsigned)},k.subtract=function(y){return n(y)||(y=h(y)),this.add(y.neg())},k.sub=k.subtract,k.multiply=function(y){if(this.isZero())return $;if(n(y)||(y=h(y)),t){var A=t.mul(this.low,this.high,y.low,y.high);return i(A,t.get_high(),this.unsigned)}if(y.isZero())return $;if(this.eq(C))return y.isOdd()?C:$;if(y.eq(C))return this.isOdd()?C:$;if(this.isNegative())return y.isNegative()?this.neg().mul(y.neg()):this.neg().mul(y).neg();if(y.isNegative())return this.mul(y.neg()).neg();if(this.lt(w)&&y.lt(w))return o(this.toNumber()*y.toNumber(),this.unsigned);var R=this.high>>>16,z=this.high&65535,V=this.low>>>16,W=this.low&65535,Y=y.high>>>16,ae=y.high&65535,te=y.low>>>16,re=y.low&65535,ve=0,ue=0,Ee=0,In=0;return In+=W*re,Ee+=In>>>16,In&=65535,Ee+=V*re,ue+=Ee>>>16,Ee&=65535,Ee+=W*te,ue+=Ee>>>16,Ee&=65535,ue+=z*re,ve+=ue>>>16,ue&=65535,ue+=V*te,ve+=ue>>>16,ue&=65535,ue+=W*ae,ve+=ue>>>16,ue&=65535,ve+=R*re+z*te+V*ae+W*Y,ve&=65535,i(Ee<<16|In,ve<<16|ue,this.unsigned)},k.mul=k.multiply,k.divide=function(y){if(n(y)||(y=h(y)),y.isZero())throw Error("division by zero");if(t){if(!this.unsigned&&this.high===-2147483648&&y.low===-1&&y.high===-1)return this;var A=(this.unsigned?t.div_u:t.div_s)(this.low,this.high,y.low,y.high);return i(A,t.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?O:$;var R,z,V;if(this.unsigned){if(y.unsigned||(y=y.toUnsigned()),y.gt(this))return O;if(y.gt(this.shru(1)))return _;V=O}else{if(this.eq(C)){if(y.eq(v)||y.eq(x))return C;if(y.eq(C))return v;var W=this.shr(1);return R=W.div(y).shl(1),R.eq($)?y.isNegative()?v:x:(z=this.sub(y.mul(R)),V=R.add(z.div(y)),V)}else if(y.eq(C))return this.unsigned?O:$;if(this.isNegative())return y.isNegative()?this.neg().div(y.neg()):this.neg().div(y).neg();if(y.isNegative())return this.div(y.neg()).neg();V=$}for(z=this;z.gte(y);){R=Math.max(1,Math.floor(z.toNumber()/y.toNumber()));for(var Y=Math.ceil(Math.log(R)/Math.LN2),ae=Y<=48?1:u(2,Y-48),te=o(R),re=te.mul(y);re.isNegative()||re.gt(z);)R-=ae,te=o(R,this.unsigned),re=te.mul(y);te.isZero()&&(te=v),V=V.add(te),z=z.sub(re)}return V},k.div=k.divide,k.modulo=function(y){if(n(y)||(y=h(y)),t){var A=(this.unsigned?t.rem_u:t.rem_s)(this.low,this.high,y.low,y.high);return i(A,t.get_high(),this.unsigned)}return this.sub(this.div(y).mul(y))},k.mod=k.modulo,k.rem=k.modulo,k.not=function(){return i(~this.low,~this.high,this.unsigned)},k.and=function(y){return n(y)||(y=h(y)),i(this.low&y.low,this.high&y.high,this.unsigned)},k.or=function(y){return n(y)||(y=h(y)),i(this.low|y.low,this.high|y.high,this.unsigned)},k.xor=function(y){return n(y)||(y=h(y)),i(this.low^y.low,this.high^y.high,this.unsigned)},k.shiftLeft=function(y){return n(y)&&(y=y.toInt()),(y&=63)===0?this:y<32?i(this.low<<y,this.high<<y|this.low>>>32-y,this.unsigned):i(0,this.low<<y-32,this.unsigned)},k.shl=k.shiftLeft,k.shiftRight=function(y){return n(y)&&(y=y.toInt()),(y&=63)===0?this:y<32?i(this.low>>>y|this.high<<32-y,this.high>>y,this.unsigned):i(this.high>>y-32,this.high>=0?0:-1,this.unsigned)},k.shr=k.shiftRight,k.shiftRightUnsigned=function(y){if(n(y)&&(y=y.toInt()),y&=63,y===0)return this;var A=this.high;if(y<32){var R=this.low;return i(R>>>y|A<<32-y,A>>>y,this.unsigned)}else return y===32?i(A,0,this.unsigned):i(A>>>y-32,0,this.unsigned)},k.shru=k.shiftRightUnsigned,k.shr_u=k.shiftRightUnsigned,k.toSigned=function(){return this.unsigned?i(this.low,this.high,!1):this},k.toUnsigned=function(){return this.unsigned?this:i(this.low,this.high,!0)},k.toBytes=function(y){return y?this.toBytesLE():this.toBytesBE()},k.toBytesLE=function(){var y=this.high,A=this.low;return[A&255,A>>>8&255,A>>>16&255,A>>>24,y&255,y>>>8&255,y>>>16&255,y>>>24]},k.toBytesBE=function(){var y=this.high,A=this.low;return[y>>>24,y>>>16&255,y>>>8&255,y&255,A>>>24,A>>>16&255,A>>>8&255,A&255]},e.fromBytes=function(y,A,R){return R?e.fromBytesLE(y,A):e.fromBytesBE(y,A)},e.fromBytesLE=function(y,A){return new e(y[0]|y[1]<<8|y[2]<<16|y[3]<<24,y[4]|y[5]<<8|y[6]<<16|y[7]<<24,A)},e.fromBytesBE=function(y,A){return new e(y[4]<<24|y[5]<<16|y[6]<<8|y[7],y[0]<<24|y[1]<<16|y[2]<<8|y[3],A)},Tr}var cl=If();const hl=ro(cl),xf=so({__proto__:null,default:hl},[cl]);/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mt=hl||xf;function yn(t){return mt.fromString(t,!0,16)}const pl=yn("c3a5c85c97cb3127"),ft=yn("b492b66fbe98f273"),fe=yn("9ae16a3b2f90404f");function Rr(t){return t.xor(t.shru(47))}function fl(t,e,n){const r=t.slice(e,e+n);return mt.fromBytes(Array.from(r),!0,!0)}function K(t,e){return fl(t,e,8)}function Ea(t,e){return fl(t,e,4)}function oe(t,e){return e===0?t:t.shru(e).or(t.shl(64-e))}function nt(t,e,n=yn("9ddfea08eb382d69")){let r=t.xor(e).mul(n);r=r.xor(r.shru(47));let s=e.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function Af(t,e,n,r,s,a){s=s.add(t),a=oe(a.add(s).add(r),21);const o=s;return s=s.add(e),s=s.add(n),a=a.add(oe(s,44)),[s.add(r),a.add(o)]}function xn(t,e,n,r){return Af(K(t,e),K(t,e+8),K(t,e+16),K(t,e+24),n,r)}function Of(t,e=t.length){if(e>=8){const n=fe.add(e*2),r=K(t,0).add(fe),s=K(t,e-8),a=oe(s,37).mul(n).add(r),o=oe(r,25).add(s).mul(n);return nt(a,o,n)}if(e>=4){const n=fe.add(e*2),r=Ea(t,0);return nt(r.shl(3).add(e),Ea(t,e-4),n)}if(e>0){const n=t[0],r=t[e>>1],s=t[e-1],a=n+(r<<8),o=e+(s<<2);return Rr(fe.mul(a).xor(pl.mul(o))).mul(fe)}return fe}function Df(t,e=t.length){const n=fe.add(e*2),r=K(t,0).mul(ft),s=K(t,8),a=K(t,e-8).mul(n),o=K(t,e-16).mul(fe);return nt(oe(r.add(s),43).add(oe(a,30)).add(o),r.add(oe(s.add(fe),18)).add(a),n)}function Ff(t,e=t.length){const n=fe.add(e*2),r=K(t,0).mul(fe),s=K(t,8),a=K(t,e-8).mul(n),o=K(t,e-16).mul(fe),i=oe(r.add(s),43).add(oe(a,30)).add(o),u=nt(i,r.add(oe(s.add(fe),18)).add(a),n),l=K(t,16).mul(n),h=K(t,24),c=i.add(K(t,e-32)).mul(n),f=u.add(K(t,e-24)).mul(n);return nt(oe(l.add(h),43).add(oe(c,30)).add(f),l.add(oe(h.add(r),18)).add(c),n)}function Cf(t,e=t.length){const n=mt.fromNumber(81,!0);if(e<=32)return e<=16?Of(t,e):Df(t,e);if(e<=64)return Ff(t,e);let r=n,s=n.mul(ft).add(113),a=Rr(s.mul(fe).add(113)).mul(fe),o=[mt.UZERO,mt.UZERO],i=[mt.UZERO,mt.UZERO];r=r.mul(fe).add(K(t,0));let u=0;const l=(e-1>>6)*64,h=l+(e-1&63)-63;do r=oe(r.add(s).add(o[0]).add(K(t,u+8)),37).mul(ft),s=oe(s.add(o[1]).add(K(t,u+48)),42).mul(ft),r=r.xor(i[1]),s=s.add(o[0]).add(K(t,u+40)),a=oe(a.add(i[0]),33).mul(ft),o=xn(t,u,o[1].mul(ft),r.add(i[0])),i=xn(t,u+32,a.add(i[1]),s.add(K(t,u+16))),[a,r]=[r,a],u+=64;while(u!==l);const c=ft.add(a.and(255).shl(1));return u=h,i[0]=i[0].add(e-1&63),o[0]=o[0].add(i[0]),i[0]=i[0].add(o[0]),r=oe(r.add(s).add(o[0]).add(K(t,u+8)),37).mul(c),s=oe(s.add(o[1]).add(K(t,u+48)),42).mul(c),r=r.xor(i[1].mul(9)),s=s.add(o[0].mul(9).add(K(t,u+40))),a=oe(a.add(i[0]),33).mul(c),o=xn(t,u,o[1].mul(c),r.add(i[0])),i=xn(t,u+32,a.add(i[1]),s.add(K(t,u+16))),[a,r]=[r,a],nt(nt(o[0],i[0],c).add(Rr(s).mul(pl)).add(a),nt(o[1],i[1],c).add(r),c)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rf(t,e){return e==="string"?bn(t):sr([t],e)}function Pf(t,e){return t instanceof Float32Array&&e==="float32"||t instanceof Int32Array&&e==="int32"||t instanceof Uint8Array&&e==="bool"}function sr(t,e){if(e==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(t)&&(t=at(t)),B().getBool("DEBUG")&&co(t,e),Pf(t,e))return t;if(e==null||e==="float32"||e==="complex64")return new Float32Array(t);if(e==="int32")return new Int32Array(t);if(e==="bool"){const n=new Uint8Array(t.length);for(let r=0;r<n.length;++r)Math.round(t[r])!==0&&(n[r]=1);return n}else throw new Error(`Unknown data type ${e}`)}function rn(){return B().platform.now()}function Lf(t,e){return B().platform.fetch(t,e)}function bn(t,e="utf-8"){return e=e||"utf-8",B().platform.encode(t,e)}function Hn(t,e="utf-8"){return e=e||"utf-8",B().platform.decode(t,e)}function ie(t){return B().platform.isTypedArray!=null?B().platform.isTypedArray(t):ll(t)}function at(t,e=[],n=!1){if(e==null&&(e=[]),typeof t=="boolean"||typeof t=="number"||typeof t=="string"||st(t)||t==null||ie(t)&&n)e.push(t);else if(Array.isArray(t)||ie(t))for(let r=0;r<t.length;++r)at(t[r],e,n);else{let r=-1;for(const s of Object.keys(t))/^([1-9]+[0-9]*|0)$/.test(s)&&(r=Math.max(r,Number(s)));for(let s=0;s<=r;s++)at(t[s],e,n)}return e}const Bf=Object.freeze(Object.defineProperty({__proto__:null,arraysEqual:Ce,arraysEqualWithNull:io,assert:g,assertNonNegativeIntegerDimensions:$e,assertNonNull:It,assertShapesMatch:ge,bytesFromStringArray:po,bytesPerElement:qn,checkConversionForErrors:co,clamp:en,computeStrides:Wt,convertBackendValuesAndArrayBuffer:Kp,createScalarValue:Rf,createShuffledIndices:qp,decodeString:Hn,distSquared:Vp,encodeString:bn,fetch:Lf,fingerPrint64:Cf,flatten:at,getArrayFromDType:us,getTypedArrayFromDType:lo,hasEncodingLoss:Hp,hexToLong:yn,indexToLoc:Jp,inferDtype:gn,inferFromImplicitShape:Gp,isBoolean:fo,isFunction:rt,isInt:Rt,isNumber:mo,isPromise:st,isScalarShape:jp,isString:Qe,isTypedArray:ie,isValidDtype:ho,locToIndex:Zp,makeOnesTypedArray:ls,makeZerosNestedTypedArray:Xp,makeZerosTypedArray:rr,nearestDivisor:Un,nearestLargerEven:Lp,now:rn,parseAxisParam:dn,randUniform:zp,repeatedTry:Up,rightPad:Yt,shuffle:oo,shuffleCombo:Pp,sizeFromShape:G,sizeToSquarishShape:Wp,squeezeShape:uo,sum:Bp,swap:Wn,tanh:Mp,toNestedArray:bt,toTypedArray:sr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class zf{constructor(e,n){this.backendTimer=e,this.logger=n,n==null&&(this.logger=new jf)}profileKernel(e,n,r){let s;const a=()=>{s=r()};let o;const i=rn();if(this.backendTimer.timerAvailable())o=this.backendTimer.time(a);else{a();for(const l of s)l.dataSync();o=Promise.resolve({kernelMs:rn()-i})}if(B().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<s.length;l++){const h=s[l];h.data().then(c=>{Vf(c,h.dtype,e)})}return{kernelName:e,outputs:s,inputs:n,timeMs:o.then(l=>l.kernelMs),extraInfo:o.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(e){const{kernelName:n,outputs:r,timeMs:s,inputs:a,extraInfo:o}=e;r.forEach(i=>{Promise.all([i.data(),s,o]).then(u=>{this.logger.logKernelProfile(n,i,u[0],u[1],a,u[2])})})}}function Vf(t,e,n){if(e!=="float32")return!1;for(let r=0;r<t.length;r++){const s=t[r];if(isNaN(s)||!isFinite(s))return console.warn(`Found ${s} in the result of '${n}'`),!0}return!1}class jf{logKernelProfile(e,n,r,s,a,o){const i=typeof s=="number"?Yt(`${s}ms`,9):s.error,u=Yt(e,25),l=n.rank,h=n.size,c=Yt(n.shape.toString(),14);let f="";for(const m in a){const b=a[m];if(b!=null){const T=b.shape||n.shape,w=T.length;f+=`${m}: ${w}D ${w>0?T:""} `}}console.log(`%c${u}	%c${i}	%c${l}D ${c}	%c${h}	%c${f}	%c${o}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mf(t,e,n){const r={},s={};for(let u=0;u<e.length;u++)r[e[u].id]=!0;for(let u=0;u<t.length;u++){const l=t[u],h=l.inputs;for(const c in h){const f=h[c];let m=!1;for(let b=0;b<e.length;b++)if(r[f.id]){l.outputs.forEach(T=>r[T.id]=!0),m=!0,s[l.id]=!0;break}if(m)break}}const a={};a[n.id]=!0;const o={};for(let u=t.length-1;u>=0;u--){const l=t[u],h=l.inputs;for(let c=0;c<l.outputs.length;c++)if(a[l.outputs[c].id]){for(const f in h)a[h[f].id]=!0,o[l.id]=!0;break}}const i=[];for(let u=0;u<t.length;u++){const l=t[u];if(s[l.id]&&o[l.id]){const h={};for(const f in l.inputs){const m=l.inputs[f];r[m.id]&&(h[f]=m)}const c=Object.assign({},l);c.inputs=h,c.outputs=l.outputs,i.push(c)}}return i}function Wf(t,e,n,r){for(let s=e.length-1;s>=0;s--){const a=e[s],o=[];if(a.outputs.forEach(u=>{const l=t[u.id];l!=null?o.push(l):o.push(null)}),a.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${a.kernelName}.`);const i=a.gradient(o);for(const u in a.inputs){if(!(u in i))throw new Error(`Cannot backprop through input ${u}. Available gradients found: ${Object.keys(i)}.`);const l=n(()=>i[u]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input ${u} must have 'float32' dtype, but has '${l.dtype}'`);const h=a.inputs[u];if(!Ce(l.shape,h.shape))throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input '${u}' has shape '${l.shape}', which does not match the shape of the input '${h.shape}'`);if(t[h.id]==null)t[h.id]=l;else{const c=t[h.id];t[h.id]=r(c,l),c.dispose()}}}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ka=20,Ht=3,$r=7;function qf(t,e,n,r){const s=Wt(e),a=Uf(t,e,n,s),o=e.length,i=Fn(t,e,n,s,a),u=["Tensor"];return r&&(u.push(`  dtype: ${n}`),u.push(`  rank: ${o}`),u.push(`  shape: [${e}]`),u.push("  values:")),u.push(i.map(l=>"    "+l).join(`
`)),u.join(`
`)}function Uf(t,e,n,r){const s=G(e),a=r[r.length-1],o=new Array(a).fill(0),i=e.length,u=n==="complex64"?Jt(t):t;if(i>1)for(let l=0;l<s/a;l++){const h=l*a;for(let c=0;c<a;c++)o[c]=Math.max(o[c],Zt(u[h+c],0,n).length)}return o}function Zt(t,e,n){let r;return Array.isArray(t)?r=`${parseFloat(t[0].toFixed($r))} + ${parseFloat(t[1].toFixed($r))}j`:Qe(t)?r=`'${t}'`:n==="bool"?r=ml(t):r=parseFloat(t.toFixed($r)).toString(),Yt(r,e)}function ml(t){return t===0?"false":"true"}function Fn(t,e,n,r,s,a=!0){const o=n==="complex64"?2:1,i=e[0],u=e.length;if(u===0){if(n==="complex64"){const T=Jt(t);return[Zt(T[0],0,n)]}return n==="bool"?[ml(t[0])]:[t[0].toString()]}if(u===1){if(i>ka){const w=Ht*o;let $=Array.from(t.slice(0,w)),O=Array.from(t.slice((i-Ht)*o,i*o));return n==="complex64"&&($=Jt($),O=Jt(O)),["["+$.map((v,_)=>Zt(v,s[_],n)).join(", ")+", ..., "+O.map((v,_)=>Zt(v,s[i-Ht+_],n)).join(", ")+"]"]}return["["+(n==="complex64"?Jt(t):Array.from(t)).map((w,$)=>Zt(w,s[$],n)).join(", ")+"]"]}const l=e.slice(1),h=r.slice(1),c=r[0]*o,f=[];if(i>ka){for(let T=0;T<Ht;T++){const w=T*c,$=w+c;f.push(...Fn(t.slice(w,$),l,n,h,s,!1))}f.push("...");for(let T=i-Ht;T<i;T++){const w=T*c,$=w+c;f.push(...Fn(t.slice(w,$),l,n,h,s,T===i-1))}}else for(let T=0;T<i;T++){const w=T*c,$=w+c;f.push(...Fn(t.slice(w,$),l,n,h,s,T===i-1))}const m=u===2?",":"";f[0]="["+(i>0?f[0]+m:"");for(let T=1;T<f.length-1;T++)f[T]=" "+f[T]+m;let b=`,
`;for(let T=2;T<u;T++)b+=`
`;return f[f.length-1]=" "+f[f.length-1]+"]"+(a?"":b),f}function Jt(t){const e=[];for(let n=0;n<t.length;n+=2)e.push([t[n],t[n+1]]);return e}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Kn{constructor(e,n,r){if(this.dtype=n,this.shape=e.slice(),this.size=G(e),r!=null){const s=r.length;g(s===this.size,()=>`Length of values '${s}' does not match the size inferred by the shape '${this.size}'.`)}if(n==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=r||us(n,this.size),this.strides=Wt(e)}set(e,...n){n.length===0&&(n=[0]),g(n.length===this.rank,()=>`The number of provided coordinates (${n.length}) must match the rank (${this.rank})`);const r=this.locToIndex(n);this.values[r]=e}get(...e){e.length===0&&(e=[0]);let n=0;for(const s of e){if(s<0||s>=this.shape[n]){const a=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(a)}n++}let r=e[e.length-1];for(let s=0;s<e.length-1;++s)r+=this.strides[s]*e[s];return this.values[r]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let n=e[e.length-1];for(let r=0;r<e.length-1;++r)n+=this.strides[r]*e[r];return n}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];const n=new Array(this.shape.length);for(let r=0;r<n.length-1;++r)n[r]=Math.floor(e/this.strides[r]),e-=n[r]*this.strides[r];return n[n.length-1]=e,n}get rank(){return this.shape.length}toTensor(){return Ae().makeTensor(this.values,this.shape,this.dtype)}}let Ae=null,xt=null;function Gf(t){Ae=t}function Hf(t){xt=t}class ne{constructor(e,n,r,s){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=n||"float32",this.size=G(e),this.strides=Wt(e),this.dataId=r,this.id=s,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return xt.buffer(this.shape,this.dtype,e)}bufferSync(){return xt.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return bt(this.shape,e,this.dtype==="complex64")}arraySync(){return bt(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const e=Ae().read(this.dataId);if(this.dtype==="string"){const n=await e;try{return n.map(r=>Hn(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),Ae().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=Ae().readSync(this.dataId);if(this.dtype==="string")try{return e.map(n=>Hn(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await Ae().read(this.dataId);return this.dtype==="string"?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),Ae().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return xt.print(this,e)}clone(){return this.throwIfDisposed(),xt.clone(this)}toString(e=!1){const n=this.dataSync();return qf(n,this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),xt.cast(this,e)}variable(e=!0,n,r){return this.throwIfDisposed(),Ae().makeVariable(this,e,n,r)}}Object.defineProperty(ne,Symbol.hasInstance,{value:t=>!!t&&t.data!=null&&t.dataSync!=null&&t.throwIfDisposed!=null});function dl(){return hs("Tensor",()=>ne)}dl();class sn extends ne{constructor(e,n,r,s){super(e.shape,e.dtype,e.dataId,s),this.trainable=n,this.name=r}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!Ce(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);Ae().disposeTensor(this),this.dataId=e.dataId,Ae().incRef(this,null)}dispose(){Ae().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(sn,Symbol.hasInstance,{value:t=>t instanceof ne&&t.assign!=null&&t.assign instanceof Function});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Pr;(function(t){t.R0="R0",t.R1="R1",t.R2="R2",t.R3="R3",t.R4="R4",t.R5="R5",t.R6="R6"})(Pr||(Pr={}));var Lr;(function(t){t.float32="float32",t.int32="int32",t.bool="int32",t.complex64="complex64"})(Lr||(Lr={}));var Br;(function(t){t.float32="float32",t.int32="int32",t.bool="bool",t.complex64="complex64"})(Br||(Br={}));var zr;(function(t){t.float32="float32",t.int32="float32",t.bool="float32",t.complex64="complex64"})(zr||(zr={}));var Vr;(function(t){t.float32="complex64",t.int32="complex64",t.bool="complex64",t.complex64="complex64"})(Vr||(Vr={}));const Kf={float32:zr,int32:Lr,bool:Br,complex64:Vr};function ar(t,e){if(t==="string"||e==="string"){if(t==="string"&&e==="string")return"string";throw new Error(`Can not upcast ${t} with ${e}`)}return Kf[t][e]}function Xf(t){return ar(t,"int32")}function gl(t){return t!=null&&typeof t=="object"&&"texture"in t&&t.texture instanceof WebGLTexture}function yl(t){return typeof GPUBuffer<"u"&&t!=null&&typeof t=="object"&&"buffer"in t&&t.buffer instanceof GPUBuffer}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ee(t,e){if(t.dtype===e.dtype)return[t,e];const n=ar(t.dtype,e.dtype);return[t.cast(n),e.cast(n)]}function bl(t,e){g(t.dtype===e.dtype,()=>`The dtypes of the first(${t.dtype}) and second(${e.dtype}) input must match`)}function Zf(t,e){return e.some(n=>n.id===t.id)}function bs(t){const e=[];return wl(t,e,new Set),e}function wl(t,e,n){if(t==null)return;if(t instanceof ne){e.push(t);return}if(!Jf(t))return;const r=t;for(const s in r){const a=r[s];n.has(a)||(n.add(a),wl(a,e,n))}}function Jf(t){return Array.isArray(t)||typeof t=="object"}const Yf=Object.freeze(Object.defineProperty({__proto__:null,assertTypesMatch:bl,getTensorsInContainer:bs,isTensorInList:Zf,makeTypesMatch:ee},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Er(t){return t.kernelName!=null}class va{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Lt{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new va}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const r=e[n];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:e,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){const{asyncInit:n}=this.initializeBackend(e);if(n)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,n,r=1){return e in this.registryFactory?(Je(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:n,priority:r},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;const{success:n,asyncInit:r}=this.initializeBackend(e);if(!(r?await n:n))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new zf(this.backendInstance),!0}setupRegisteredKernels(){Gn(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){Gn(e).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[e])})}initializeBackend(e){const n=this.registryFactory[e];if(n==null)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const r=n.factory();if(r&&!(r instanceof ao)&&typeof r.then=="function"){const s=++this.pendingBackendInitId,a=r.then(o=>s<this.pendingBackendInitId?!1:(this.registry[e]=o,this.pendingBackendInit=null,!0)).catch(o=>(s<this.pendingBackendInitId||(this.pendingBackendInit=null,Je(`Initialization of backend ${e} failed`),Je(o.stack||o.message)),!1));return this.pendingBackendInit=a,{success:a,asyncInit:!0}}else return this.registry[e]=r,{success:!0,asyncInit:!1}}catch(r){return Je(`Initialization of backend ${e} failed`),Je(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((e,n)=>this.registryFactory[n].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let n=0;n<e.length;n++){const r=e[n],{success:s,asyncInit:a}=this.initializeBackend(r);if(a||s)return{name:r,asyncInit:a}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,n){const r=this.state.tensorInfo.get(n),s=r.backend,a=this.readSync(n),o=s.refCount(n);s.disposeData(n,!0),r.backend=e,e.move(n,a,r.shape,r.dtype,o),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,n){let r=null;if(n==null){if(typeof e!="function")throw new Error("Please provide a function to tidy()");n=e}else{if(typeof e!="string"&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=e}let s;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(s),()=>(s=n(),s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),s))}scopedRun(e,n,r){e();try{const s=r();return n(),s}catch(s){throw n(),s}}nextTensorId(){return Lt.nextTensorId++}nextVariableId(){return Lt.nextVariableId++}clone(e){const n=S.runKernel(ds,{x:e}),r={x:e},s=o=>({x:()=>{const i="float32",u={x:o},l={dtype:i};return S.runKernel(fs,u,l)}}),a=[];return this.addTapeNode(this.state.activeScope.name,r,[n],s,a,{}),n}runKernel(e,n,r){if(this.backendName==null&&this.backend,!(nn(e,this.backendName)!=null))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:n,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,n,r){const s=this.backend.numDataIds();let a=0;r.forEach(u=>{a+=u.dtype==="complex64"?3:1});const o=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],i=s-n-a-o;if(i>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${i} data ids) after running '${e}'`)}runKernelFunc(e){let n,r=[];const s=this.isTapeOn(),a=this.state.numBytes,o=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let i;this.backendName==null&&this.backend;let u;const l=Er(e)?e.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Er(e)){const{kernelName:b,inputs:T,attrs:w}=e;this.backendName==null&&this.backend;const $=nn(b,this.backendName);g($!=null,()=>`Cannot find registered kernel '${b}' for backend '${this.backendName}'`),i=()=>{const O=this.backend.numDataIds();u=$.kernelFunc({inputs:T,attrs:w,backend:this.backend});const v=Array.isArray(u)?u:[u];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(b,O,v);const _=v.map(x=>x.rank!=null?x:this.makeTensorFromTensorInfo(x));if(s){const x=this.getTensorsForGradient(b,T,_);r=this.saveTensorsForBackwardMode(x)}return _}}else{const{forwardFunc:b}=e,T=w=>{s&&(r=w.map($=>this.keep(this.clone($))))};i=()=>{const w=this.backend.numDataIds();u=this.tidy(()=>b(this.backend,T));const $=Array.isArray(u)?u:[u];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,w,$),$}}const{inputs:h,attrs:c}=e,f=Er(e)?null:e.backwardsFunc;let m;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=i():(m=this.profiler.profileKernel(l,h,()=>i()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(m),n=m.outputs)}),s&&this.addTapeNode(l,h,n,f,r,c),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-a,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-o,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(b=>h[b]!=null?h[b].shape:null),outputShapes:n.map(b=>b.shape),kernelTimeMs:m.timeMs,extraInfo:m.extraInfo}),Array.isArray(u)?n:n[0]}saveTensorsForBackwardMode(e){return e.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(e,n,r){const s=Cr(e);if(s!=null){const a=s.inputsToSave||[],o=s.outputsToSave||[];let i;s.saveAllInputs?(g(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),i=Object.keys(n).map(l=>n[l])):i=a.map(l=>n[l]);const u=r.filter((l,h)=>o[h]);return i.concat(u)}return[]}makeTensor(e,n,r,s){if(e==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",s=s||this.backend;let a=e;r==="string"&&Qe(e[0])&&(a=e.map(u=>bn(u)));const o=s.write(a,n,r),i=new ne(n,r,o,this.nextTensorId());if(this.trackTensor(i,s),r==="string"){const u=this.state.tensorInfo.get(o),l=po(a);this.state.numBytes+=l-u.bytes,u.bytes=l}return i}makeTensorFromDataId(e,n,r,s){r=r||"float32";const a={dataId:e,shape:n,dtype:r};return this.makeTensorFromTensorInfo(a,s)}makeTensorFromTensorInfo(e,n){const{dataId:r,shape:s,dtype:a}=e,o=new ne(s,a,r,this.nextTensorId());return this.trackTensor(o,n),o}makeVariable(e,n=!0,r,s){r=r||this.nextVariableId().toString(),s!=null&&s!==e.dtype&&(e=e.cast(s));const a=new sn(e,n,r,this.nextTensorId());if(this.state.registeredVariables[a.name]!=null)throw new Error(`Variable with name ${a.name} was already registered`);return this.state.registeredVariables[a.name]=a,this.incRef(a,this.backend),a}trackTensor(e,n){this.state.numTensors++,e.dtype==="string"&&this.state.numStringTensors++;let r=0;e.dtype!=="complex64"&&e.dtype!=="string"&&(r=e.size*qn(e.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:n||this.backend,dtype:e.dtype,shape:e.shape,bytes:r})),e instanceof sn||this.track(e)}incRef(e,n){this.trackTensor(e,n),this.backend.incRef(e.dataId)}removeDataId(e,n){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===n&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const n=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),e.dtype!=="complex64"&&e.dtype!=="string"){const r=e.size*qn(e.dtype);this.state.numBytes-=r}n.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,n.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const n=this.state.registeredVariables[e];this.disposeVariable(n)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons==null&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const n=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(s=>s.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-r;for(const s of this.state.activeProfile.kernels)s.kernelTimeMs=await s.kernelTimeMs,s.extraInfo=await s.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,n,r,s,a,o){const i={id:this.state.nextTapeNodeId++,kernelName:e,inputs:n,outputs:r,saved:a},u=Cr(e);u!=null&&(s=u.gradFunc),s!=null&&(i.gradient=l=>(l=l.map((h,c)=>{if(h==null){const f=r[c],m=rr(f.size,f.dtype);return this.makeTensor(m,f.shape,f.dtype)}return h}),s(l.length>1?l:l[0],a,o))),this.state.activeTape.push(i)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(n.name=e),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(e){const n=bs(e),r=new Set(n.map(a=>a.id));for(let a=0;a<this.state.activeScope.track.length;a++){const o=this.state.activeScope.track[a];!o.kept&&!r.has(o.id)&&o.dispose()}const s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(a=>{!a.kept&&a.scopeId===s.id&&this.track(a)})}gradients(e,n,r,s=!1){if(g(n.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);const a=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",e));g(a instanceof ne,()=>"The result y returned by f() must be a tensor.");const o=Mf(this.state.activeTape,n,a);if(!s&&o.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const i={};i[a.id]=r??Qf(a.shape),Wf(i,o,l=>this.tidy(l),em);const u=n.map(l=>i[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(const h of l.saved)h.dispose()}),this.state.activeTape=null),{value:a,grads:u}})}customGrad(e){return g(rt(e),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{g(n.every(i=>i instanceof ne),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r;const s={};n.forEach((i,u)=>{s[u]=i});const a=(i,u)=>(r=e(...n,u),g(r.value instanceof ne,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),g(rt(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),o=(i,u)=>{const l=r.gradFunc(i,u),h=Array.isArray(l)?l:[l];g(h.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),g(h.every(f=>f instanceof ne),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const c={};return h.forEach((f,m)=>{c[m]=()=>f}),c};return this.runKernelFunc({forwardFunc:a,backwardsFunc:o,inputs:s})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,n){return this.state.tensorInfo.get(e).backend.readToGPU(e,n)}async time(e){const n=rn(),r=await this.backend.time(e);return r.wallMs=rn()-n,r}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new va;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}Lt.nextTensorId=0;Lt.nextVariableId=0;function Qf(t){const e=ls(G(t),"float32");return S.makeTensor(e,t,"float32")}function Nl(){const t=bo();if(t._tfengine==null){const e=new yo(t);t._tfengine=new Lt(e)}return tf(t._tfengine.ENV),Gf(()=>t._tfengine),t._tfengine}const S=Nl();function em(t,e){const n={a:t,b:e};return S.runKernel(ps,n)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tm(){return typeof navigator<"u"&&navigator!=null}let jr;function nm(t){jr=t}function rm(t){if(jr!==void 0)return jr;if(t||tm()){if(t||(t=navigator),t.product==="ReactNative")return!0;const e=t.userAgent||t.vendor||(typeof window<"u"?window.opera:"");if(!e){const n=t;return n.userAgentData&&n.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}function Sl(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const sm=Object.freeze(Object.defineProperty({__proto__:null,isBrowser:Sl,isMobile:rm,mockIsMobile:nm},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ye=B();ye.registerFlag("DEBUG",()=>!1,t=>{t&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});ye.registerFlag("IS_BROWSER",()=>Sl());ye.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");ye.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));ye.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));ye.registerFlag("PROD",()=>!1);ye.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>ye.getBool("DEBUG"));ye.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);ye.registerFlag("IS_TEST",()=>!1);ye.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>ye.getBool("DEBUG"));ye.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);ye.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);ye.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Le(t,e){let n=t;if(ie(t))return e==="string"?[]:[t.length];if(gl(t)){const s=t.channels||"RGBA";return[t.height,t.width*s.length]}else if(yl(t))return[t.buffer.size/(e==null?4:qn(e))];if(!Array.isArray(t))return[];const r=[];for(;Array.isArray(n)||ie(n)&&e!=="string";)r.push(n.length),n=n[0];return Array.isArray(t)&&B().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Tl(t,r,[]),r}function Tl(t,e,n){if(n=n||[],!Array.isArray(t)&&!ie(t)){g(e.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${e[0]} elements`);return}g(e.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${t.length} elements`),g(t.length===e[0],()=>`Element arr[${n.join("][")}] should have ${e[0]} elements, but has ${t.length} elements`);const r=e.slice(1);for(let s=0;s<t.length;++s)Tl(t[s],r,n.concat(s))}function _a(t,e,n,r){if(t!=="string_or_numeric"){if(t==null)throw new Error("Expected dtype cannot be null.");if(t!=="numeric"&&t!==e||t==="numeric"&&e==="string")throw new Error(`Argument '${n}' passed to '${r}' must be ${t} tensor, but got ${e} tensor`)}}function d(t,e,n,r="numeric"){if(t instanceof dl())return _a(r,t.dtype,e,n),t;let s=gn(t);if(s!=="string"&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),_a(r,s,e,n),t==null||!ie(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string"){const u=t==null?"null":t.constructor.name;throw new Error(`Argument '${e}' passed to '${n}' must be a Tensor or TensorLike, but got '${u}'`)}const a=Le(t,s);!ie(t)&&!Array.isArray(t)&&(t=[t]);const i=s!=="string"?sr(t,s):at(t,[],!0);return S.makeTensor(i,a,s)}function an(t,e,n,r="numeric"){if(!Array.isArray(t))throw new Error(`Argument ${e} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return t.map((a,o)=>d(a,`${e}[${o}]`,n,r))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ws="__op";function N(t){const e=Object.keys(t);if(e.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${e.length} keys.`);let n=e[0];const r=t[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+ws;const s=(...a)=>{S.startScope(n);try{const o=r(...a);return st(o)&&console.error("Cannot return a Promise inside of tidy."),S.endScope(o),o}catch(o){throw S.endScope(null),o}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function am(t,e){const n=d(t,"real","complex"),r=d(e,"imag","complex");ge(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return S.runKernel(jo,s)}const Ke=N({complex_:am});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lt(t,e,n,r){if(r==null)r=gn(t);else if(r==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(yl(t)||gl(t)){if(r!=="float32"&&r!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${r}.`);return S.backend.createTensorFromGPUData(t,e||n,r)}if(!ie(t)&&!Array.isArray(t)&&typeof t!="number"&&typeof t!="boolean"&&typeof t!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(e!=null){$e(e);const s=G(e),a=G(n);g(s===a,()=>`Based on the provided shape, [${e}], the tensor should have ${s} values but has ${a}`);for(let o=0;o<n.length;++o){const i=n[o],u=o===n.length-1?i!==G(e.slice(o)):!0;g(n[o]===e[o]||!u,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${e}). `)}}return!ie(t)&&!Array.isArray(t)&&(t=[t]),e=e||n,t=r!=="string"?sr(t,r):at(t,[],!0),S.makeTensor(t,e,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function De(t,e,n){const r=Le(t,n);return lt(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const St={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};class Re{static join(e){return new Re(e).slice()}constructor(e){if(this.shards=[],this.previousShardIndex=0,e==null||(e instanceof Array||(e=[e]),e=e.map(r=>ie(r)?r.buffer:r),e.length===0))return;this.bufferUniformSize=e[0].byteLength;let n=0;for(let r=0;r<e.length;r++){const s=e[r];r!==e.length-1&&s.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const a=n+s.byteLength;this.shards.push({buffer:s,start:n,end:a}),n=a}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(e=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(e=isNaN(Number(e))?0:e,n=isNaN(Number(n))?0:n,e=Math.max(0,e),n=Math.min(this.byteLength,n),n<=e)return new ArrayBuffer(0);const r=this.findShardForByte(e);if(r===-1)throw new Error(`Could not find start shard for byte ${e}`);const s=n-e,a=new ArrayBuffer(s),o=new Uint8Array(a);let i=0;for(let u=r;u<this.shards.length;u++){const l=this.shards[u],c=e+i-l.start,f=i,b=Math.min(n,l.end)-l.start,T=new Uint8Array(l.buffer,c,b-c);if(o.set(T,f),i+=T.length,n<l.end)break}return a}findShardForByte(e){if(this.shards.length===0||e<0||e>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(e/this.bufferUniformSize),this.previousShardIndex;function n(s){return e<s.start?-1:e>=s.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const r=om(this.shards,n);return r===-1?-1:(this.previousShardIndex=r,this.previousShardIndex)}}function om(t,e){let n=0,r=t.length;for(;n<=r;){const s=Math.floor((r-n)/2)+n,a=e(t[s]);if(a===0)return s;a<0?r=s:n=s+1}return-1}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function im(){B().set("PROD",!0)}function um(){B().set("DEBUG",!0)}function lm(){B().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function cm(t){B().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(t+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function hm(){S.disposeVariables()}function pm(){return S}function fm(){return S.memory()}function mm(t){return S.profile(t)}function U(t,e){return S.tidy(t,e)}function de(t){bs(t).forEach(n=>n.dispose())}function Oe(t){return S.keep(t)}function dm(t){return S.time(t)}function gm(t){return S.setBackend(t)}function ym(){return S.ready()}function $l(){return S.backendName}function bm(t){S.removeBackend(t)}function wm(t){return S.findBackend(t)}function Nm(t){return S.findBackendFactory(t)}function Sm(t,e,n=1){return S.registerBackend(t,e,n)}function El(){return S.backend}function Tm(t,e){B().setPlatform(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ot=4;async function $m(t,e){const n=[],r=[],s=Array.isArray(t)?t.map(o=>o.name):Object.keys(t);for(let o=0;o<s.length;++o){const i=s[o],u=Array.isArray(t)?t[o].tensor:t[i];if(u.dtype!=="float32"&&u.dtype!=="int32"&&u.dtype!=="bool"&&u.dtype!=="string"&&u.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${i}': ${u.dtype}`);const l={name:i,shape:u.shape,dtype:u.dtype};if(u.dtype==="string"){const h=new Promise(async c=>{const f=await u.bytes(),m=f.reduce((w,$)=>w+$.length,0)+ot*f.length,b=new Uint8Array(m);let T=0;for(let w=0;w<f.length;w++){const $=f[w],O=new Uint8Array(new Uint32Array([$.length]).buffer);b.set(O,T),T+=ot,b.set($,T),T+=$.length}c(b)});r.push(h)}else r.push(u.data());e!=null&&(l.group=e),n.push(l)}const a=await Promise.all(r);return{data:vm(a),specs:n}}function kl(t,e){const n=new Re(t),r={};let s=0;for(const a of e){const o=Em(a,(i,u)=>n.slice(s+i,s+u));r[a.name]=vl(a,n.slice(s,s+o)),s+=o}return r}function Em(t,e){const n=G(t.shape);let r;if("quantization"in t){const s=t.quantization;r=St[s.dtype]}else if(t.dtype==="string"){let s=0;for(let a=0;a<n;a++)s+=ot+new Uint32Array(e(s,s+ot))[0];return s}else r=St[t.dtype];return n*r}async function km(t,e){const n=G(t.shape);let r;if("quantization"in t){const s=t.quantization;r=St[s.dtype]}else if(t.dtype==="string"){let s=0;for(let a=0;a<n;a++)s+=ot+new Uint32Array(await e(s,s+ot))[0];return s}else r=St[t.dtype];return n*r}function vl(t,e){const n=t.name,r=t.dtype,s=t.shape,a=G(s);let o,i=0;if("quantization"in t){const u=t.quantization;if(u.dtype==="uint8"||u.dtype==="uint16"){if(!("min"in u&&"scale"in u))throw new Error(`Weight ${t.name} with quantization ${u.dtype} doesn't have corresponding metadata min and scale.`)}else if(u.dtype==="float16"){if(r!=="float32")throw new Error(`Weight ${t.name} is quantized with ${u.dtype} which only supports weights of type float32 not ${r}.`)}else throw new Error(`Weight ${t.name} has unknown quantization dtype ${u.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const l=St[u.dtype],h=u.dtype==="uint8"?new Uint8Array(e):new Uint16Array(e);if(r==="float32")if(u.dtype==="uint8"||u.dtype==="uint16"){o=new Float32Array(h.length);for(let c=0;c<h.length;c++){const f=h[c];o[c]=f*u.scale+u.min}}else if(u.dtype==="float16")o=Fm()(h);else throw new Error(`Unsupported quantization type ${u.dtype} for weight type float32.`);else if(r==="int32"){if(u.dtype!=="uint8"&&u.dtype!=="uint16")throw new Error(`Unsupported quantization type ${u.dtype} for weight type int32.`);o=new Int32Array(h.length);for(let c=0;c<h.length;c++){const f=h[c];o[c]=Math.round(f*u.scale+u.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=a*l}else if(r==="string"){const u=G(t.shape);o=[];for(let l=0;l<u;l++){const h=new Uint32Array(e.slice(i,i+ot))[0];i+=ot;const c=new Uint8Array(e.slice(i,i+h));o.push(c),i+=h}}else{const u=St[r];if(r==="float32")o=new Float32Array(e);else if(r==="int32")o=new Int32Array(e);else if(r==="bool")o=new Uint8Array(e);else if(r==="complex64"){o=new Float32Array(e);const l=new Float32Array(o.length/2),h=new Float32Array(o.length/2);for(let b=0;b<l.length;b++)l[b]=o[b*2],h[b]=o[b*2+1];const c=De(l,s,"float32"),f=De(h,s,"float32"),m=Ke(c,f);return c.dispose(),f.dispose(),m}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=a*u}return De(o,s,r)}async function Ia(t,e,n){let r=new Uint8Array(e);for(;r.byteLength<n;){const{done:s,value:a}=await t.read();if(s&&a==null){const i=n-r.byteLength;throw new Error(`Reader is done but ${i} bytes are still expected`)}const o=new Uint8Array(r.length+a.byteLength);o.set(r,0),o.set(new Uint8Array(a),r.length),r=o}return r.buffer}async function _l(t,e){const n={},r=t.getReader();let s=new ArrayBuffer(0);for(const a of e){const o=await km(a,async(l,h)=>(s=await Ia(r,s,h),s.slice(l,h)));s=await Ia(r,s,o);const i=s.slice(0,o);s=s.slice(o);const u=vl(a,i);if(n[a.name]=u,$l()==="webgpu"){const l=El();"uploadToGPU"in l&&G(u.shape)>=B().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&l.uploadToGPU(u.dataId)}}return n}function vm(t){if(t===null)throw new Error(`Invalid input value: ${JSON.stringify(t)}`);let e=0;const n=[];t.forEach(a=>{if(e+=a.byteLength,n.push(a.byteLength===a.buffer.byteLength?a:new a.constructor(a)),!(a instanceof Float32Array||a instanceof Int32Array||a instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${a.constructor.name}`)});const r=new Uint8Array(e);let s=0;return n.forEach(a=>{r.set(new Uint8Array(a.buffer),s),s+=a.byteLength}),r.buffer}const Ns=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function xa(t){return Ns?Buffer.byteLength(t,"utf8"):new Blob([t]).size}function _m(t){if(Ns)return Buffer.from(t).toString("base64");const e=new Uint8Array(t);let n="";for(let r=0,s=e.length;r<s;r++)n+=String.fromCharCode(e[r]);return btoa(n)}function Im(t){if(Ns){const r=Buffer.from(t,"base64");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}const e=atob(t),n=new Uint8Array(e.length);for(let r=0;r<e.length;++r)n.set([e.charCodeAt(r)],r);return n.buffer}function xm(t){return Re.join(t)}function Aa(t){for(t=t.trim();t.endsWith("/");)t=t.slice(0,t.length-1);const n=t.split("/");return n[n.length-1]}function Il(t,e){const n={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,weightsManifest:e};return t.signature!=null&&(n.signature=t.signature),t.userDefinedMetadata!=null&&(n.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(n.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(n.initializerSignature=t.initializerSignature),t.trainingConfig!=null&&(n.trainingConfig=t.trainingConfig),n}function Ss(t,e,n){const r={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy};if(t.trainingConfig!=null&&(r.trainingConfig=t.trainingConfig),t.weightsManifest!=null){if(!e)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=e,r.weightData=n}return t.signature!=null&&(r.signature=t.signature),t.userDefinedMetadata!=null&&(r.userDefinedMetadata=t.userDefinedMetadata),t.modelInitializer!=null&&(r.modelInitializer=t.modelInitializer),t.initializerSignature!=null&&(r.initializerSignature=t.initializerSignature),r}async function Ts(t,e){let n,r;return t.weightsManifest!=null&&([n,r]=await e(t.weightsManifest)),Ss(t,n,r)}function wn(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:t.modelTopology==null?0:xa(JSON.stringify(t.modelTopology)),weightSpecsBytes:t.weightSpecs==null?0:xa(JSON.stringify(t.weightSpecs)),weightDataBytes:t.weightData==null?0:new Re(t.weightData).byteLength}}function Xn(t){const e=[];for(const n of t)e.push(...n.weights);return e}function Am(){const t=n=>{let r=n<<13,s=0;for(;(r&8388608)===0;)s-=8388608,r<<=1;return r&=-8388609,s+=947912704,r|s},e=new Uint32Array(2048);e[0]=0;for(let n=1;n<1024;n++)e[n]=t(n);for(let n=1024;n<2048;n++)e[n]=939524096+(n-1024<<13);return e}function Om(){const t=new Uint32Array(64);t[0]=0,t[31]=1199570944,t[32]=2147483648,t[63]=3347054592;for(let e=1;e<31;e++)t[e]=e<<23;for(let e=33;e<63;e++)t[e]=2147483648+(e-32<<23);return t}function Dm(){const t=new Uint32Array(64);for(let e=0;e<64;e++)t[e]=1024;return t[0]=t[32]=0,t}function Fm(){const t=Am(),e=Om(),n=Dm();return r=>{const s=new ArrayBuffer(4*r.length),a=new Uint32Array(s);for(let o=0;o<r.length;o++){const i=r[o],u=t[n[i>>10]+(i&1023)]+e[i>>10];a[o]=u}return new Float32Array(s)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Q{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return Q.instance==null&&(Q.instance=new Q),Q.instance}static registerSaveRouter(e){Q.getInstance().saveRouters.push(e)}static registerLoadRouter(e){Q.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return Q.getHandlers(e,"save")}static getLoadHandlers(e,n){return Q.getHandlers(e,"load",n)}static getHandlers(e,n,r){const s=[];return(n==="load"?Q.getInstance().loadRouters:Q.getInstance().saveRouters).forEach(o=>{const i=o(e,r);i!==null&&s.push(i)}),s}}const Cm=t=>Q.registerSaveRouter(t),Rm=t=>Q.registerLoadRouter(t),Pm=t=>Q.getSaveHandlers(t),Lm=(t,e)=>Q.getLoadHandlers(t,e);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mr="tensorflowjs",Wr=1,yt="models_store",et="model_info_store";function xl(){if(!B().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const t=typeof window>"u"?self:window,e=t.indexedDB||t.mozIndexedDB||t.webkitIndexedDB||t.msIndexedDB||t.shimIndexedDB;if(e==null)throw new Error("The current browser does not appear to support IndexedDB.");return e}function qr(t){const e=t.result;e.createObjectStore(yt,{keyPath:"modelPath"}),e.createObjectStore(et,{keyPath:"modelPath"})}class Tt{constructor(e){if(this.indexedDB=xl(),e==null||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,n){return new Promise((r,s)=>{const a=this.indexedDB.open(Mr,Wr);a.onupgradeneeded=()=>qr(a),a.onsuccess=()=>{const o=a.result;if(n==null){const i=o.transaction(yt,"readonly"),l=i.objectStore(yt).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return o.close(),s(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));r(l.result.modelArtifacts)},l.onerror=h=>(o.close(),s(l.error)),i.oncomplete=()=>o.close()}else{n.weightData=Re.join(n.weightData);const i=wn(n),u=o.transaction(et,"readwrite");let l=u.objectStore(et),h;try{h=l.put({modelPath:this.modelPath,modelArtifactsInfo:i})}catch(f){return s(f)}let c;h.onsuccess=()=>{c=o.transaction(yt,"readwrite");const f=c.objectStore(yt);let m;try{m=f.put({modelPath:this.modelPath,modelArtifacts:n,modelArtifactsInfo:i})}catch(b){return s(b)}m.onsuccess=()=>r({modelArtifactsInfo:i}),m.onerror=b=>{l=u.objectStore(et);const T=l.delete(this.modelPath);T.onsuccess=()=>(o.close(),s(m.error)),T.onerror=w=>(o.close(),s(m.error))}},h.onerror=f=>(o.close(),s(h.error)),u.oncomplete=()=>{c==null?o.close():c.oncomplete=()=>o.close()}}},a.onerror=o=>s(a.error)})}}Tt.URL_SCHEME="indexeddb://";const Al=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(Tt.URL_SCHEME)?Bm(t.slice(Tt.URL_SCHEME.length)):null;Q.registerSaveRouter(Al);Q.registerLoadRouter(Al);function Bm(t){return new Tt(t)}function zm(t){return t.startsWith(Tt.URL_SCHEME)?t.slice(Tt.URL_SCHEME.length):t}class Vm{constructor(){this.indexedDB=xl()}async listModels(){return new Promise((e,n)=>{const r=this.indexedDB.open(Mr,Wr);r.onupgradeneeded=()=>qr(r),r.onsuccess=()=>{const s=r.result,a=s.transaction(et,"readonly"),i=a.objectStore(et).getAll();i.onsuccess=()=>{const u={};for(const l of i.result)u[l.modelPath]=l.modelArtifactsInfo;e(u)},i.onerror=u=>(s.close(),n(i.error)),a.oncomplete=()=>s.close()},r.onerror=s=>n(r.error)})}async removeModel(e){return e=zm(e),new Promise((n,r)=>{const s=this.indexedDB.open(Mr,Wr);s.onupgradeneeded=()=>qr(s),s.onsuccess=()=>{const a=s.result,o=a.transaction(et,"readwrite"),i=o.objectStore(et),u=i.get(e);let l;u.onsuccess=()=>{if(u.result==null)return a.close(),r(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const h=i.delete(e),c=()=>{l=a.transaction(yt,"readwrite");const m=l.objectStore(yt).delete(e);m.onsuccess=()=>n(u.result.modelArtifactsInfo),m.onerror=b=>r(u.error)};h.onsuccess=c,h.onerror=f=>(c(),a.close(),r(u.error))}},u.onerror=h=>(a.close(),r(u.error)),o.oncomplete=()=>{l==null?a.close():l.oncomplete=()=>a.close()}},s.onerror=a=>r(s.error)})}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ue="/",At="tensorflowjs_models",Ol="info",jm="model_topology",Mm="weight_specs",Wm="weight_data",qm="model_metadata";function Dl(t){return{info:[At,t,Ol].join(Ue),topology:[At,t,jm].join(Ue),weightSpecs:[At,t,Mm].join(Ue),weightData:[At,t,Wm].join(Ue),modelMetadata:[At,t,qm].join(Ue)}}function Fl(t){for(const e of Object.values(t))window.localStorage.removeItem(e)}function Um(t){const e=t.split(Ue);if(e.length<3)throw new Error(`Invalid key format: ${t}`);return e.slice(1,e.length-1).join(Ue)}function Gm(t){return t.startsWith($t.URL_SCHEME)?t.slice($t.URL_SCHEME.length):t}class $t{constructor(e){if(!B().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,e==null||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=Dl(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const n=JSON.stringify(e.modelTopology),r=JSON.stringify(e.weightSpecs),s=wn(e),a=Re.join(e.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(s)),this.LS.setItem(this.keys.topology,n),this.LS.setItem(this.keys.weightSpecs,r),this.LS.setItem(this.keys.weightData,_m(a));const o={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature!=null?e.signature:void 0,userDefinedMetadata:e.userDefinedMetadata!=null?e.userDefinedMetadata:void 0,modelInitializer:e.modelInitializer!=null?e.modelInitializer:void 0,initializerSignature:e.initializerSignature!=null?e.initializerSignature:void 0,trainingConfig:e.trainingConfig!=null?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(o)),{modelArtifactsInfo:s}}catch{throw Fl(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${s.modelTopologyBytes}, weightSpecsBytes=${s.weightSpecsBytes}, weightDataBytes=${s.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const n={},r=JSON.parse(this.LS.getItem(this.keys.topology));if(r==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);n.modelTopology=r;const s=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(s==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);n.weightSpecs=s;const a=this.LS.getItem(this.keys.modelMetadata);if(a!=null){const i=JSON.parse(a);n.format=i.format,n.generatedBy=i.generatedBy,n.convertedBy=i.convertedBy,i.signature!=null&&(n.signature=i.signature),i.userDefinedMetadata!=null&&(n.userDefinedMetadata=i.userDefinedMetadata),i.modelInitializer!=null&&(n.modelInitializer=i.modelInitializer),i.initializerSignature!=null&&(n.initializerSignature=i.initializerSignature),i.trainingConfig!=null&&(n.trainingConfig=i.trainingConfig)}const o=this.LS.getItem(this.keys.weightData);if(o==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return n.weightData=Im(o),n}}$t.URL_SCHEME="localstorage://";const Cl=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith($t.URL_SCHEME)?Hm(t.slice($t.URL_SCHEME.length)):null;Q.registerSaveRouter(Cl);Q.registerLoadRouter(Cl);function Hm(t){return new $t(t)}class Km{constructor(){g(B().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),g(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const e={},n=At+Ue,r=Ue+Ol;for(let s=0;s<this.LS.length;++s){const a=this.LS.key(s);if(a.startsWith(n)&&a.endsWith(r)){const o=Um(a);e[o]=JSON.parse(this.LS.getItem(a))}}return e}async removeModel(e){e=Gm(e);const n=Dl(e);if(this.LS.getItem(n.info)==null)throw new Error(`Cannot find model at path '${e}'`);const r=JSON.parse(this.LS.getItem(n.info));return Fl(n),r}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ot="://";class pe{constructor(){this.managers={}}static getInstance(){return pe.instance==null&&(pe.instance=new pe),pe.instance}static registerManager(e,n){g(e!=null,()=>"scheme must not be undefined or null."),e.endsWith(Ot)&&(e=e.slice(0,e.indexOf(Ot))),g(e.length>0,()=>"scheme must not be an empty string.");const r=pe.getInstance();g(r.managers[e]==null,()=>`A model store manager is already registered for scheme '${e}'.`),r.managers[e]=n}static getManager(e){const n=pe.getInstance().managers[e];if(n==null)throw new Error(`Cannot find model manager for scheme '${e}'`);return n}static getSchemes(){return Object.keys(pe.getInstance().managers)}}function Cn(t){if(t.indexOf(Ot)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${pe.getSchemes().join(",")}`);return{scheme:t.split(Ot)[0],path:t.split(Ot)[1]}}async function Rl(t,e,n=!1){g(t!==e,()=>`Old path and new path are the same: '${t}'`);const r=Q.getLoadHandlers(t);g(r.length>0,()=>`Copying failed because no load handler is found for source URL ${t}.`),g(r.length<2,()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${t}.`);const s=r[0],a=Q.getSaveHandlers(e);g(a.length>0,()=>`Copying failed because no save handler is found for destination URL ${e}.`),g(a.length<2,()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${e}.`);const o=a[0],i=Cn(t).scheme,u=Cn(t).path,l=i===Cn(t).scheme,h=await s.load();n&&l&&await pe.getManager(i).removeModel(u);const c=await o.save(h);return n&&!l&&await pe.getManager(i).removeModel(u),c.modelArtifactsInfo}async function Xm(){const t=pe.getSchemes(),e={};for(const n of t){const r=await pe.getManager(n).listModels();for(const s in r){const a=n+Ot+s;e[a]=r[s]}}return e}async function Zm(t){const e=Cn(t);return pe.getManager(e.scheme).removeModel(e.path)}async function Jm(t,e){return Rl(t,e,!1)}async function Ym(t,e){return Rl(t,e,!0)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Qm{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,n){return fetch(e,n)}now(){return performance.now()}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,n){return new TextDecoder(n).decode(e)}setTimeoutCustom(e,n){if(typeof window>"u"||!B().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,n);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},n),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",r=>{if(r.source===window&&r.data.name===this.messageName){r.stopPropagation();const s=this.functionRefs[r.data.index];s(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return ll(e)}}if(B().get("IS_BROWSER")){B().setPlatform("browser",new Qm);try{pe.registerManager($t.URL_SCHEME,new Km)}catch{}try{pe.registerManager(Tt.URL_SCHEME,new Vm)}catch{}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ed={importFetch:()=>require("node-fetch")};let kr;class td{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,n){return B().global.fetch!=null?B().global.fetch(e,n):(kr==null&&(kr=ed.importFetch()),kr(e,n))}now(){const e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${n}`);return this.textEncoder.encode(e)}decode(e,n){return e.length===0?"":new this.util.TextDecoder(n).decode(e)}isTypedArray(e){return this.util.types.isFloat32Array(e)||this.util.types.isInt32Array(e)||this.util.types.isUint8Array(e)||this.util.types.isUint8ClampedArray(e)}}B().get("IS_NODE")&&!B().get("IS_BROWSER")&&B().setPlatform("node",new td);/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Be(t,e="float32",n){return e=e||"float32",$e(t),new Kn(t,e,n)}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nd(t,e){const n=d(t,"x","cast");if(!ho(e))throw new Error(`Failed to cast to unknown dtype ${e}`);if(e==="string"&&n.dtype!=="string"||e!=="string"&&n.dtype==="string")throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:e};return S.runKernel(fs,r,s)}const J=N({cast_:nd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rd(t){const n={x:d(t,"x","clone","string_or_numeric")};return S.runKernel(ds,n)}const Ge=N({clone_:rd});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $s(t,e=!1){console.log(t.toString(e))}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Nl();const sd={buffer:Be,cast:J,clone:Ge,print:$s};Hf(sd);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ad(t,e){let n=d(t,"a","add"),r=d(e,"b","add");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(ps,s)}const L=N({add_:ad});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function od(t,e){let n=d(t,"a","floorDiv"),r=d(e,"b","floorDiv");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(wi,s)}const Es=N({floorDiv_:od});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function id(t,e){let n=d(t,"a","div"),r=d(e,"b","div");if([n,r]=ee(n,r),n.dtype==="int32"&&r.dtype==="int32")return Es(n,r);const s={a:n,b:r},a={};return S.runKernel(ii,s,a)}const Z=N({div_:id});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ud(t,e){let n=d(t,"a","mul"),r=d(e,"b","mul");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(Ji,s)}const F=N({mul_:ud});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ld(t){const e=d(t,"x","abs");if(e.dtype==="complex64"){const n={x:e};return S.runKernel(Mo,n)}else{const n={x:e};return S.runKernel(wo,n)}}const Se=N({abs_:ld});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cd(t){const n={x:d(t,"x","acos")};return S.runKernel(No,n)}const Pl=N({acos_:cd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hd(t){const n={x:d(t,"x","acosh")};return S.runKernel(So,n)}const Ll=N({acosh_:hd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pd(t){g(Array.isArray(t),()=>"The argument passed to tf.addN() must be a list of tensors"),g(t.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${t.length}`);const e=t.map((s,a)=>d(s,`tensors${a}`,"addN")),n=e[0];e.forEach(s=>{if(s.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),e.forEach(s=>{if(!Ce(s.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});const r=e;return S.runKernel(To,r)}const Bl=N({addN_:pd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fd(t,e=null,n=!1){const s={x:d(t,"x","all","bool")},a={axis:e,keepDims:n};return S.runKernel($o,s,a)}const zl=N({all_:fd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function md(t,e=null,n=!1){const s={x:d(t,"x","any","bool")},a={axis:e,keepDims:n};return S.runKernel(Eo,s,a)}const Vl=N({any_:md});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dd(t,e=0){const r={x:d(t,"x","argMax")},s={axis:e};return S.runKernel(ko,r,s)}const jl=N({argMax_:dd});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gd(t,e=0){const r={x:d(t,"x","argMin")},s={axis:e};return S.runKernel(vo,r,s)}const Ml=N({argMin_:gd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yd(t){const n={x:d(t,"x","asin")};return S.runKernel(_o,n)}const Wl=N({asin_:yd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bd(t){const n={x:d(t,"x","asinh")};return S.runKernel(Io,n)}const ql=N({asinh_:bd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wd(t){const n={x:d(t,"x","atan")};return S.runKernel(xo,n)}const Ul=N({atan_:wd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nd(t,e){let n=d(t,"a","atan2"),r=d(e,"b","atan2");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(Oo,s)}const Gl=N({atan2_:Nd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sd(t){const n={x:d(t,"x","atanh")};return S.runKernel(Ao,n)}const Hl=N({atanh_:Sd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Td(t,e,n,r,s="NHWC",a){const o=t[3],i=[...e,o],u=Zl(s);return Nn(t,i,n,a,r,null,null,u)}function Kl(t,e,n,r,s,a,o="channelsLast"){const[i,u]=on(e);let l;if(o==="channelsLast")l=[i,u,t[3],t[3]];else if(o==="channelsFirst")l=[i,u,t[1],t[1]];else throw new Error(`Unknown dataFormat ${o}`);return Nn(t,l,n,r,s,a,!1,o)}function $d(t,e,n,r,s,a,o="NDHWC"){const[i,u,l]=Ur(e);let h,c;if(o==="NDHWC")c="channelsLast",h=[i,u,l,t[4],t[4]];else if(o==="NCDHW")c="channelsFirst",h=[i,u,l,t[1],t[1]];else throw new Error(`Unknown dataFormat ${o}`);return Xl(t,h,n,r,s,!1,c,a)}function Nn(t,e,n,r,s,a,o=!1,i="channelsLast"){let[u,l,h,c]=[-1,-1,-1,-1];if(i==="channelsLast")[u,l,h,c]=t;else if(i==="channelsFirst")[u,c,l,h]=t;else throw new Error(`Unknown dataFormat ${i}`);const[f,m,,b]=e,[T,w]=on(n),[$,O]=on(r),v=Dt(f,$),_=Dt(m,O),{padInfo:x,outHeight:D,outWidth:P}=vd(s,l,h,T,w,v,_,a,i),C=o?b*c:b;let k;return i==="channelsFirst"?k=[u,C,D,P]:i==="channelsLast"&&(k=[u,D,P,C]),{batchSize:u,dataFormat:i,inHeight:l,inWidth:h,inChannels:c,outHeight:D,outWidth:P,outChannels:C,padInfo:x,strideHeight:T,strideWidth:w,filterHeight:f,filterWidth:m,effectiveFilterHeight:v,effectiveFilterWidth:_,dilationHeight:$,dilationWidth:O,inShape:t,outShape:k,filterShape:e}}function Xl(t,e,n,r,s,a=!1,o="channelsLast",i){let[u,l,h,c,f]=[-1,-1,-1,-1,-1];if(o==="channelsLast")[u,l,h,c,f]=t;else if(o==="channelsFirst")[u,f,l,h,c]=t;else throw new Error(`Unknown dataFormat ${o}`);const[m,b,T,,w]=e,[$,O,v]=Ur(n),[_,x,D]=Ur(r),P=Dt(m,_),C=Dt(b,x),k=Dt(T,D),{padInfo:E,outDepth:y,outHeight:A,outWidth:R}=_d(s,l,h,c,$,O,v,P,C,k,i),z=a?w*f:w;let V;return o==="channelsFirst"?V=[u,z,y,A,R]:o==="channelsLast"&&(V=[u,y,A,R,z]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:h,inWidth:c,inChannels:f,outDepth:y,outHeight:A,outWidth:R,outChannels:z,padInfo:E,strideDepth:$,strideHeight:O,strideWidth:v,filterDepth:m,filterHeight:b,filterWidth:T,effectiveFilterDepth:P,effectiveFilterHeight:C,effectiveFilterWidth:k,dilationDepth:_,dilationHeight:x,dilationWidth:D,inShape:t,outShape:V,filterShape:e}}function Ed(t,e,n,r,s){r==null&&(r=ks(t,e,n));const a=t[0],o=t[1],i=un((a-e+2*r)/n+1,s),u=un((o-e+2*r)/n+1,s);return[i,u]}function kd(t,e,n,r,s,a){s==null&&(s=ks(t,e[0],r[0]));const o=[0,0,0,n];for(let i=0;i<3;i++)t[i]+2*s>=e[i]&&(o[i]=un((t[i]-e[i]+2*s)/r[i]+1,a));return o}function ks(t,e,n,r=1){const s=Dt(e,r);return Math.floor((t[0]*(n-1)-n+s)/2)}function on(t){return typeof t=="number"?[t,t,t]:t.length===2?[t[0],t[1],1]:t}function Ur(t){return typeof t=="number"?[t,t,t]:t}function Dt(t,e){return e<=1?t:t+(t-1)*(e-1)}function vd(t,e,n,r,s,a,o,i,u){let l,h,c;if(typeof t=="number"){l={top:t,bottom:t,left:t,right:t,type:t===0?"VALID":"NUMBER"};const m=Ed([e,n],a,r,t,i);h=m[0],c=m[1]}else if(t==="same"){h=Math.ceil(e/r),c=Math.ceil(n/s);const f=Math.max(0,(h-1)*r+a-e),m=Math.max(0,(c-1)*s+o-n),b=Math.floor(f/2),T=f-b,w=Math.floor(m/2),$=m-w;l={top:b,bottom:T,left:w,right:$,type:"SAME"}}else if(t==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((e-a+1)/r),c=Math.ceil((n-o+1)/s);else if(typeof t=="object"){const f=u==="channelsLast"?t[1][0]:t[2][0],m=u==="channelsLast"?t[1][1]:t[2][1],b=u==="channelsLast"?t[2][0]:t[3][0],T=u==="channelsLast"?t[2][1]:t[3][1];l={top:f,bottom:m,left:b,right:T,type:f===0&&m===0&&b===0&&T===0?"VALID":"EXPLICIT"},h=un((e-a+f+m)/r+1,i),c=un((n-o+b+T)/s+1,i)}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:l,outHeight:h,outWidth:c}}function _d(t,e,n,r,s,a,o,i,u,l,h){let c,f,m,b;if(t==="valid"&&(t=0),typeof t=="number"){c={top:t,bottom:t,left:t,right:t,front:t,back:t,type:t===0?"VALID":"NUMBER"};const w=kd([e,n,r,1],[i,u,l],1,[s,a,o],t,h);f=w[0],m=w[1],b=w[2]}else if(t==="same"){f=Math.ceil(e/s),m=Math.ceil(n/a),b=Math.ceil(r/o);const T=(f-1)*s+i-e,w=(m-1)*a+u-n,$=(b-1)*o+l-r,O=Math.floor(T/2),v=T-O,_=Math.floor(w/2),x=w-_,D=Math.floor($/2),P=$-D;c={top:_,bottom:x,left:D,right:P,front:O,back:v,type:"SAME"}}else throw Error(`Unknown padding parameter: ${t}`);return{padInfo:c,outDepth:f,outHeight:m,outWidth:b}}function un(t,e){if(!e)return Math.trunc(t);switch(e){case"round":return Math.round(t);case"ceil":return Math.ceil(t);case"floor":return Math.floor(t);default:throw new Error(`Unknown roundingMode ${e}`)}}function ln(t){const[e,n,r]=on(t);return e===1&&n===1&&r===1}function Xe(t,e){return ln(t)||ln(e)}function Et(t){return on(t).every(e=>e>0)}function Zl(t){if(t==="NHWC")return"channelsLast";if(t==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${t}`)}function xe(t,e,n){if(n!=null){if(typeof e=="string")throw Error(`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);if(typeof e=="number")g(Rt(e),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${e}.`);else if(typeof e=="object")e.forEach(r=>{r.forEach(s=>{g(Rt(s),()=>`Error in ${t}: pad must be an integer when using dimRoundingMode ${n} but got pad ${s}.`)})});else throw Error(`Error in ${t}: Unknown padding parameter: ${e}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Id(t,e){const r={x:d(t,"x","reshape","string_or_numeric")},s={shape:e};return S.runKernel(yu,r,s)}const I=N({reshape_:Id});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xd(t,e,n,r,s){const a=d(t,"x","avgPool","float32"),o=1;g(Xe(n,o),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`);let i=a,u=!1;a.rank===3&&(u=!0,i=I(a,[1,a.shape[0],a.shape[1],a.shape[2]])),g(i.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${i.rank}.`),xe("avgPool",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s};let c=S.runKernel(Do,l,h);return c=J(c,a.dtype),u?I(c,[c.shape[1],c.shape[2],c.shape[3]]):c}const vs=N({avgPool_:xd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ad(t,e,n,r,s,a="NDHWC"){const o=d(t,"x","avgPool3d","float32");let i=o,u=!1;o.rank===4&&(u=!0,i=I(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),g(i.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`),g(a==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),g(typeof n=="number"&&n>0||Array.isArray(n)&&n[0]>0&&n[1]>0&&n[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${n}'`),xe("avgPool3d",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s,dataFormat:a};let c=S.runKernel(Fo,l,h);return c=J(c,i.dtype),u?I(c,[c.shape[1],c.shape[2],c.shape[3],c.shape[4]]):c}const Jl=N({avgPool3d_:Ad});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Od(t,e=0){g(t.length>=1,()=>"Pass at least one tensor to concat");const n=an(t,"tensors","concat","string_or_numeric");if(n[0].dtype==="complex64"&&n.forEach(a=>{if(a.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${a.dtype}. `)}),n.length===1)return Ge(n[0]);const r=n,s={axis:e};return S.runKernel(Wo,r,s)}const he=N({concat_:Od});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dd(t,e,n=!1,r=!1){let s=d(t,"a","matMul"),a=d(e,"b","matMul");[s,a]=ee(s,a);const o={a:s,b:a},i={transposeA:n,transposeB:r};return S.runKernel(Co,o,i)}const q=N({matMul_:Dd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fd(t){const n={x:d(t,"x","sigmoid","float32")};return S.runKernel(Fu,n)}const wt=N({sigmoid_:Fd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cd(t,e,n){const r=d(t,"x","slice","string_or_numeric");if(r.rank===0)throw new Error("Slicing scalar is not possible");const s={x:r},a={begin:e,size:n};return S.runKernel(xu,s,a)}const H=N({slice_:Cd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rd(t){const n={x:d(t,"x","tanh","float32")};return S.runKernel(Qu,n)}const Zn=N({tanh_:Rd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pd(t,e,n,r,s,a){const o=d(t,"forgetBias","basicLSTMCell"),i=d(e,"lstmKernel","basicLSTMCell"),u=d(n,"lstmBias","basicLSTMCell"),l=d(r,"data","basicLSTMCell"),h=d(s,"c","basicLSTMCell"),c=d(a,"h","basicLSTMCell"),f=he([l,c],1),m=q(f,i),b=L(m,u),T=b.shape[0],w=b.shape[1]/4,$=[T,w],O=H(b,[0,0],$),v=H(b,[0,w],$),_=H(b,[0,w*2],$),x=H(b,[0,w*3],$),D=L(F(wt(O),Zn(v)),F(h,wt(L(o,_)))),P=F(Zn(D),wt(x));return[D,P]}const Yl=N({basicLSTMCell_:Pd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ld(t,e,n){const r=d(t,"x","batchToSpaceND"),s=e.reduce((i,u)=>i*u);g(r.rank>=1+e.length,()=>`input rank is ${r.rank} but should be > than blockShape.length ${e.length}`),g(n.length===e.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${e.length}`),g(r.shape[0]%s===0,()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${e.join(" * ")} === ${s}`);const a={x:r},o={blockShape:e,crops:n};return S.runKernel(Ro,a,o)}const _s=N({batchToSpaceND_:Ld});function Bd(t){let e;return t.rank===0||t.rank===1?e=I(t,[1,1,1,t.size]):t.rank===2?e=I(t,[1,1,t.shape[0],t.shape[1]]):t.rank===3?e=I(t,[1,t.shape[0],t.shape[1],t.shape[2]]):e=t,e}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zd(t,e,n,r,s,a){a==null&&(a=.001);const o=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),u=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;r!=null&&(h=d(r,"offset","batchNorm")),g(i.rank===u.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),g(h==null||i.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),g(l==null||i.rank===l.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const f={x:Bd(o),scale:l,offset:h,mean:i,variance:u},m={varianceEpsilon:a},b=S.runKernel(Ni,f,m);return I(b,o.shape)}const Sn=N({batchNorm_:zd});function Vd(t,e,n,r,s,a){const o=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),u=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(o.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`),g(i.rank===2||i.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`),g(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${u.rank}.`),l!=null&&g(l.rank===2||l.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),Sn(o,i,u,h,l,a)}const Ql=N({batchNorm2d_:Vd});function jd(t,e,n,r,s,a){const o=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),u=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(o.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`),g(i.rank===3||i.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`),g(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${u.rank}.`),l!=null&&g(l.rank===3||l.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),Sn(o,i,u,h,l,a)}const ec=N({batchNorm3d_:jd});function Md(t,e,n,r,s,a){const o=d(t,"x","batchNorm"),i=d(e,"mean","batchNorm"),u=d(n,"variance","batchNorm");let l;s!=null&&(l=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),g(o.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`),g(i.rank===4||i.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`),g(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${u.rank}.`),l!=null&&g(l.rank===4||l.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${l.rank}.`),h!=null&&g(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),Sn(o,i,u,h,l,a)}const tc=N({batchNorm4d_:Md});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wd(t,e,n){const r=d(t,"x","bincount"),s=d(e,"weights","bincount");g(r.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`),g(n>=0,()=>`size must be non-negative, but got ${n}.`),g(s.size===r.size||s.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`);const a={x:r,weights:s},o={size:n};return S.runKernel(Po,a,o)}const Is=N({bincount_:Wd});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qd(t,e){const n=d(t,"x","bitwiseAnd"),r=d(e,"y","bitwiseAnd");if(!Ce(n.shape,r.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${n.shape}, y: ${r.shape}`);if(n.dtype!=="int32"||r.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${n.dtype} and type of y: ${r.dtype}`);const s={a:n,b:r};return S.runKernel(Lo,s)}const nc=N({bitwiseAnd_:qd});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ud(t,e){const n=d(t,"s0","broadcastArgs","int32"),r=d(e,"s1","broadcastArgs","int32");if(n.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(r.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return S.runKernel(Bo,s)}const rc=N({broadcastArgs_:Ud});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gd(t,e){let n=d(t,"broadcastTo","x");const r=n.shape;if($e(e),e.length<n.rank)throw new Error(`broadcastTo(): shape.length=${e.length} < input.rank=${n.rank}.`);if(e.length>n.rank){const l=n.shape.slice();for(;l.length<e.length;)l.unshift(1);n=I(n,l)}const s=n.shape,a=Array.from(e);for(let l=e.length-1;l>=0;l--)if(s[l]===e[l])a[l]=1;else if(n.shape[l]!==1)throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${e}].`);if(a.map((l,h)=>l>1?h:-1).filter(l=>l>=0).length===0)return Ge(n);const i={x:n},u={reps:a};return S.runKernel(gs,i,u)}const Qt=N({broadcastTo_:Gd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hd(t){const n={x:d(t,"x","ceil","float32")};return S.runKernel(zo,n)}const sc=N({ceil_:Hd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qt(t,e,n){$e(t),n=n||gn(e);const r={shape:t,value:e,dtype:n};return S.runKernel(gi,{},r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kd(t,e,n){const r=d(t,"x","clipByValue");if(g(e<=n,()=>`Error in clip: min (${e}) must be less than or equal to max (${n}).`),e===n)return qt(r.shape,e,r.dtype);const s={x:r},a={clipValueMin:e,clipValueMax:n};return S.runKernel(Vo,s,a)}const ac=N({clipByValue_:Kd});function Xd(t){return he(t,0)}const oc=N({concat1d_:Xd});function Zd(t,e){return he(t,e)}const ic=N({concat2d_:Zd});function Jd(t,e){return he(t,e)}const uc=N({concat3d_:Jd});function Yd(t,e){return he(t,e)}const lc=N({concat4d_:Yd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qd(t,e,n,r,s="NHWC",a=[1,1],o){const i=d(t,"x","conv2d","float32"),u=d(e,"filter","conv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=I(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(l.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${l.rank}.`),g(u.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${u.rank}.`),xe("conv2d",r,o);const c=s==="NHWC"?l.shape[3]:l.shape[1];g(c===u.shape[2],()=>`Error in conv2d: depth of input (${c}) must match input depth for filter ${u.shape[2]}.`),g(Xe(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),g(Et(a),()=>"Error in conv2D: Dilated rates should be larger than 0."),g(Et(n),()=>"Error in conv2D: Strides should be larger than 0.");const f={x:l,filter:u},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},b=S.runKernel(qo,f,m);return h?I(b,[b.shape[1],b.shape[2],b.shape[3]]):b}const Tn=N({conv2d_:Qd});function eg(t,e,n,r,s="NWC",a=1,o){const i=d(t,"x","conv1d"),u=d(e,"filter","conv1d");let l=i,h=!1;i.rank===2&&(h=!0,l=I(i,[1,i.shape[0],i.shape[1]])),g(l.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${l.rank}.`),g(u.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${u.rank}.`),xe("conv1d",r,o),g(l.shape[2]===u.shape[1],()=>`Error in conv1d: depth of input (${l.shape[2]}) must match input depth for filter ${u.shape[1]}.`),g(Xe(n,a),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${a}'`),g(Et(a),()=>"Error in conv1D: Dilated rates should be larger than 0."),g(Et(n),()=>"Error in conv1D: Stride should be larger than 0."),g(s==="NWC",()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`);const c=I(u,[1,u.shape[0],u.shape[1],u.shape[2]]),f=I(l,[l.shape[0],1,l.shape[1],l.shape[2]]),w=Tn(f,c,[1,n],r,"NHWC",[1,a],o);return h?I(w,[w.shape[2],w.shape[3]]):I(w,[w.shape[0],w.shape[2],w.shape[3]])}const cc=N({conv1d_:eg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tg(t,e,n,r,s,a="NHWC",o){g(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let i=t,u=e,l=!1;e.rank===3&&(l=!0,u=I(e,[1,e.shape[0],e.shape[1],e.shape[2]]),i=[1,t[0],t[1],t[2]]),g(i.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`),g(u.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${u.rank}`),g(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);const h=a==="NHWC"?i[3]:i[1],c=a==="NHWC"?u.shape[3]:u.shape[1];g(h===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),g(c===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${c}) must match output depth for filter ${n.shape[3]}.`),xe("conv2dDerInput",s,o);const f={dy:u,filter:n},m={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,inputShape:i},b=S.runKernel(Go,f,m);return l?I(b,[b.shape[1],b.shape[2],b.shape[3]]):b}const hc=N({conv2DBackpropInput_:tg});function ng(t,e,n,r,s,a){const o=d(t,"x","conv2dTranspose"),i=d(e,"filter","conv2dTranspose");return hc(n,o,i,r,s,"NHWC",a)}const pc=N({conv2dTranspose_:ng});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rg(t,e,n,r,s="NDHWC",a=[1,1,1]){const o=d(t,"x","conv3d"),i=d(e,"filter","conv3d");let u=o,l=!1;o.rank===4&&(l=!0,u=I(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),g(u.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${u.rank}.`),g(i.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`),g(u.shape[4]===i.shape[3],()=>`Error in conv3d: depth of input (${u.shape[4]}) must match input depth for filter ${i.shape[3]}.`),g(Xe(n,a),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),g(s==="NDHWC",()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`),g(Et(a),()=>"Error in conv3D: Dilated rates should be larger than 0."),g(Et(n),()=>"Error in conv3D: Strides should be larger than 0.");const h={x:u,filter:i},c={strides:n,pad:r,dataFormat:s,dilations:a},f=S.runKernel(Ho,h,c);return l?I(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const fc=N({conv3d_:rg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sg(t,e,n,r,s){g(t.length===e.rank,()=>`Length of inShape (${t.length}) and rank of dy (${e.rank}) must match`);let a=t,o=e,i=!1;e.rank===4&&(i=!0,o=I(e,[1,e.shape[0],e.shape[1],e.shape[2],e.shape[3]]),a=[1,t[0],t[1],t[2],t[3]]);const u=a[4],l=o.shape[4];g(a.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${a.length}.`),g(o.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`),g(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),g(u===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${u}) must match input depth for filter ${n.shape[3]}.`),g(l===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${l}) must match output depth for filter ${n.shape[4]}.`);const h={dy:o,filter:n},c={pad:s,strides:r,inputShape:a},f=S.runKernel(Ko,h,c);return i?I(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const ag=N({conv3DBackpropInput_:sg});function og(t,e,n,r,s){const a=d(t,"x","conv3dTranspose"),o=d(e,"filter","conv3dTranspose");return ag(n,a,o,r,s)}const mc=N({conv3dTranspose_:og});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ig(t){const n={x:d(t,"x","cos","float32")};return S.runKernel(Xo,n)}const dc=N({cos_:ig});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ug(t){const n={x:d(t,"x","cosh","float32")};return S.runKernel(Zo,n)}const gc=N({cosh_:ug});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lg(t,e=0,n=!1,r=!1){const a={x:d(t,"x","cumprod")},o={axis:e,exclusive:n,reverse:r};return S.runKernel(Jo,a,o)}const yc=N({cumprod_:lg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cg(t,e=0,n=!1,r=!1){const a={x:d(t,"x","cumsum")},o={axis:e,exclusive:n,reverse:r};return S.runKernel(Yo,a,o)}const bc=N({cumsum_:cg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hg(t,e,n,r=!1){const s=d(t,"x","denseBincount"),a=d(e,"weights","denseBincount");g(s.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`),g(s.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`),g(n>=0,()=>`size must be non-negative, but got ${n}.`),g(a.size===s.size||a.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${a.shape}.`);const o={x:s,weights:a},i={size:n,binaryOutput:r};return S.runKernel(ei,o,i)}const wc=N({denseBincount_:hg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pg(t,e,n="NHWC"){const r=d(t,"x","depthToSpace","float32"),s=n==="NHWC"?r.shape[1]:r.shape[2],a=n==="NHWC"?r.shape[2]:r.shape[3],o=n==="NHWC"?r.shape[3]:r.shape[1];g(e>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${e}`),g(s*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${e}  for depthToSpace with input shape
    ${r.shape}`),g(a*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${a} and ${e} for depthToSpace with input shape
        ${r.shape}`),g(o%(e*e)===0,()=>`Dimension size must be evenly divisible by ${e*e} but is ${o} for depthToSpace with input shape ${r.shape}`);const i={x:r},u={blockSize:e,dataFormat:n};return S.runKernel(ti,i,u)}const Nc=N({depthToSpace_:pg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fg(t,e,n,r,s="NHWC",a=[1,1],o){const i=d(t,"x","depthwiseConv2d","float32"),u=d(e,"filter","depthwiseConv2d","float32");let l=i,h=!1;i.rank===3&&(h=!0,l=I(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(l.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${l.rank}.`),g(u.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${u.rank}.`);const c=s==="NHWC"?l.shape[3]:l.shape[1];g(c===u.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${c}) must match the inChannels dimension in filter ${u.shape[2]}.`),xe("depthwiseConv2d",r,o);const f={x:l,filter:u},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},b=S.runKernel(ni,f,m);return h?I(b,[b.shape[1],b.shape[2],b.shape[3]]):b}const or=N({depthwiseConv2d_:fg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mg(t){const n={x:d(t,"x","diag")};return S.runKernel(ai,n)}const Sc=N({diag_:mg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dg(t,e,n,r,s=[1,1],a="NHWC"){const o=d(t,"x","dilation2d"),i=d(e,"filter","dilation2d");g(o.rank===3||o.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`),g(i.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`),g(a==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${a}`);let u=o,l=!1;o.rank===3&&(u=I(o,[1,o.shape[0],o.shape[1],o.shape[2]]),l=!0),g(u.shape[3]===i.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${u.shape[3]} vs ${i.shape[2]}`);const h={x:u,filter:i},c={strides:n,pad:r,dilations:s},f=S.runKernel(oi,h,c);return l?I(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const Tc=N({dilation2d_:dg});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $c(t,e){const n=t.length,r=[];for(let s=0;s<n;s++){const a=n-1-s,o=t[a]||1;(e[e.length-1-s]||1)>1&&o===1&&r.unshift(a)}return r}function xs(t,e){const n=[];for(let r=0;r<e.length;r++){const s=t[t.length-r-1],a=e.length-r-1,o=e[a];(s==null||s===1&&o>1)&&n.unshift(a)}return n}function se(t,e){const n=Math.max(t.length,e.length),r=new Array(n);for(let s=0;s<n;s++){let a=t[t.length-s-1];a==null&&(a=1);let o=e[e.length-s-1];if(o==null&&(o=1),a===1)r[n-s-1]=o;else if(o===1)r[n-s-1]=a;else if(a!==o){const i=`Operands could not be broadcast together with shapes ${t} and ${e}.`;throw Error(i)}else r[n-s-1]=a}return r}const gg=Object.freeze(Object.defineProperty({__proto__:null,assertAndGetBroadcastShape:se,getBroadcastDims:$c,getReductionAxes:xs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yg(t,e){let n=d(t,"a","equal","string_or_numeric"),r=d(e,"b","equal","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(hi,s)}const As=N({equal_:yg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bg(t,e,n){const r=d(e,"a","where"),s=d(n,"b","where"),a=d(t,"condition","where","bool"),o=se(se(a.shape,r.shape),s.shape),i=Qt(a,o),u=Qt(r,o),l=Qt(s,o),h={condition:i,t:u,e:l};return S.runKernel(_u,h)}const He=N({where_:bg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wg(t){const n={x:d(t,"x","zerosLike")};return S.runKernel(al,n)}const Te=N({zerosLike_:wg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ng(t,e){let n=d(t,"a","div"),r=d(e,"b","div");[n,r]=ee(n,r);const s=Z(n,r),a=Te(s),o=As(r,a);return He(o,a,s)}const Ec=N({divNoNan_:Ng});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sg(t,e){const n=d(t,"t1","dot"),r=d(e,"t2","dot");g((n.rank===1||n.rank===2)&&(r.rank===1||r.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`);const s=n.rank===1?n.size:n.shape[1],a=r.rank===1?r.size:r.shape[0];if(g(s===a,()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${a}.`),n.rank===1&&r.rank===1){const o=I(n,[1,-1]),i=I(r,[-1,1]),u=q(o,i);return I(u,[])}else if(n.rank===1&&r.rank===2){const o=I(n,[1,-1]),i=I(r,[r.shape[0],r.shape[1]]),u=q(o,i);return I(u,[u.size])}else if(n.rank===2&&r.rank===1){const o=I(r,[-1,1]),i=q(n,o);return I(i,[i.size])}else{const o=I(r,[r.shape[0],r.shape[1]]);return q(n,o)}}const kc=N({dot_:Sg});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tg(t,...e){const n=e.map((s,a)=>d(s,`tensors${a}`,"einsum")),r={equation:t};return S.runKernel(ui,n,r)}const dt=N({einsum_:Tg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $g(t){const n={x:d(t,"x","elu","float32")};return S.runKernel(li,n)}const Os=N({elu_:$g});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eg(t,e){const n=d(t,"x","ensureShape","string_or_numeric");if(!io(n.shape,e))throw new Error(`EnsureShape: Shape of tensor ${n.shape} is not compatible with expected shape ${e}`);return t}const vc=N({ensureShape_:Eg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kg(t){let e=d(t,"x","erf");g(e.dtype==="int32"||e.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),e.dtype==="int32"&&(e=J(e,"float32"));const n={x:e};return S.runKernel(ci,n)}const _c=N({erf_:kg});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ds(t,e){for(let n=0;n<t.length;++n)if(t[t.length-n-1]!==e-1-n)return!1;return!0}function Ic(t,e,n){const r=t.length+e.length,s=[];let a=0,o=0;for(let i=0;i<r;i++)n.indexOf(i)===-1?s.push(t[a++]):s.push(e[o++]);return s}function vg(t,e){const n=[],r=t.length;for(let a=0;a<r;a++)e.indexOf(a)===-1&&n.push(t[a]);const s=e.map(a=>t[a]);return[n,s]}function $n(t,e){const n=e.map(r=>1);return Ic(t,n,e)}function _g(t,e,n){g(Ds(e,n),()=>`${t} supports only inner-most axes for now. Got axes ${e} and rank-${n} input.`)}function Ig(t,e){if(Ds(t,e))return null;const n=[];for(let r=0;r<e;++r)t.indexOf(r)===-1&&n.push(r);return t.forEach(r=>n.push(r)),n}function xg(t){return t.map((e,n)=>[n,e]).sort((e,n)=>e[1]-n[1]).map(e=>e[0])}function Ag(t,e){const n=[];for(let r=e-t;r<e;++r)n.push(r);return n}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Og(t,e=null,n=!1){const s={x:d(t,"x","max")},a={reductionIndices:e,keepDims:n};return S.runKernel(Vi,s,a)}const Nt=N({max_:Og});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dg(t,e=null,n=!1){const s={x:d(t,"x","min")},a={axis:e,keepDims:n};return S.runKernel(Gi,s,a)}const Jn=N({min_:Dg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fg(t,e){let n=d(t,"base","pow"),r=d(e,"exp","pow");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(iu,s)}const Bt=N({pow_:Fg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function M(t,e){if((ie(t)&&e!=="string"||Array.isArray(t))&&e!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(e==="string"&&ie(t)&&!(t instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return lt(t,[],[],e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cg(t){const n={x:d(t,"x","sqrt","float32")};return S.runKernel(Ru,n)}const ze=N({sqrt_:Cg});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rg(t){const e=d(t,"x","square"),n={};return S.runKernel("Square",{x:e},n)}const Ie=N({square_:Rg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pg(t,e=null,n=!1){let r=d(t,"x","sum");r.dtype==="bool"&&(r=J(r,"int32"));const s={x:r},a={axis:e,keepDims:n};return S.runKernel(Pu,s,a)}const X=N({sum_:Pg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lg(t,e="euclidean",n=null,r=!1){t=d(t,"x","norm");const s=xc(t,e,n);let a=s.shape;if(r){const o=dn(n,t.shape);a=$n(s.shape,o)}return I(s,a)}function xc(t,e,n=null){if(t.rank===0)return Se(t);if(t.rank!==1&&n===null)return xc(I(t,[-1]),e,n);if(t.rank===1||typeof n=="number"||Array.isArray(n)&&n.length===1){if(e===1)return X(Se(t),n);if(e===1/0)return Nt(Se(t),n);if(e===-1/0)return Jn(Se(t),n);if(e==="euclidean"||e===2)return ze(X(Bt(Se(t),M(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}if(Array.isArray(n)&&n.length===2){if(e===1)return Nt(X(Se(t),n[0]),n[1]-1);if(e===1/0)return Nt(X(Se(t),n[1]),n[0]);if(e===-1/0)return Jn(X(Se(t),n[1]),n[0]);if(e==="fro"||e==="euclidean")return ze(X(Ie(t),n));throw new Error(`Error in norm: invalid ord value: ${e}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const En=N({norm_:Lg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bg(t,e=null,n=!1){return En(t,"euclidean",e,n)}const Ac=N({euclideanNorm_:Bg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zg(t){const n={x:d(t,"x","exp")};return S.runKernel(pi,n)}const it=N({exp_:zg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vg(t,e=0){const n=d(t,"x","expandDims","string_or_numeric");g(e<=n.rank,()=>"Axis must be <= rank of the tensor");const r={input:n},s={dim:e};return S.runKernel(fi,r,s)}const Me=N({expandDims_:Vg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jg(t){const n={x:d(t,"x","expm1")};return S.runKernel(mi,n)}const Oc=N({expm1_:jg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mg(t,e){const n=d(t,"x","tile","string_or_numeric");g(n.rank===e.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${e}.`);const r={x:n},s={reps:e};return S.runKernel(gs,r,s)}const Ft=N({tile_:Mg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wg(t,e,n,r="float32"){e==null&&(e=t);const s=Be([t,e],r),a=t<=e?t:e;for(let i=0;i<a;++i)s.set(1,i,i);const o=I(s.toTensor(),[t,e]);if(n==null)return o;if(n.length===1)return Ft(Me(o,0),[n[0],1,1]);if(n.length===2)return Ft(Me(Me(o,0),0),[n[0],n[1],1,1]);if(n.length===3)return Ft(Me(Me(Me(o,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const Fs=N({eye_:Wg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qg(t){const n={x:d(t,"x","floor","float32")};return S.runKernel(bi,n)}const Cs=N({floor_:qg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ug(t,e,n=0,r=0){const s=d(t,"x","gather"),a=d(e,"indices","gather","int32"),o={x:s,indices:a},i={axis:n,batchDims:r};return S.runKernel(Si,o,i)}const Rs=N({gather_:Ug});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gg(t,e){let n=d(t,"a","greater","string_or_numeric"),r=d(e,"b","greater","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel($i,s)}const kn=N({greater_:Gg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hg(t,e){let n=d(t,"a","greaterEqual","string_or_numeric"),r=d(e,"b","greaterEqual","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Ei,s)}const Ps=N({greaterEqual_:Hg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kg(t){const n={input:d(t,"input","imag")};return S.runKernel(vi,n)}const vn=N({imag_:Kg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xg(t){const n={x:d(t,"x","isFinite")};return S.runKernel(_i,n)}const Dc=N({isFinite_:Xg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zg(t){const n={x:d(t,"x","isInf")};return S.runKernel(Ii,n)}const Fc=N({isInf_:Zg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jg(t){const n={x:d(t,"x","isNaN")};return S.runKernel(xi,n)}const Cc=N({isNaN_:Jg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yg(t,e=.2){const r={x:d(t,"x","leakyRelu")},s={alpha:e};return S.runKernel(Ai,r,s)}const Ls=N({leakyRelu_:Yg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qg(t,e){let n=d(t,"a","less","string_or_numeric"),r=d(e,"b","less","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Oi,s)}const Yn=N({less_:Qg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ey(t,e){let n=d(t,"a","lessEqual","string_or_numeric"),r=d(e,"b","lessEqual","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Di,s)}const ir=N({lessEqual_:ey});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rc(t,e,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:t,stop:e,num:n};return S.runKernel(Fi,{},r)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ty(t,e=5,n=1,r=1,s=.5){const a=d(t,"x","localResponseNormalization");g(a.rank===4||a.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${a.rank}.`),g(Rt(e),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${e}.`);let o=a,i=!1;a.rank===3&&(i=!0,o=I(a,[1,a.shape[0],a.shape[1],a.shape[2]]));const u={x:o},l={depthRadius:e,bias:n,alpha:r,beta:s},h=S.runKernel(zi,u,l);return i?I(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Pc=N({localResponseNormalization_:ty});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ny(t){const n={x:d(t,"x","log","float32")};return S.runKernel(Ci,n)}const zt=N({log_:ny});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ry(t){const n={x:d(t,"x","log1p")};return S.runKernel(Ri,n)}const Bs=N({log1p_:ry});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sy(t){return g(rt(t),()=>"The f passed in grad(f) must be a function"),(e,n)=>{const r=d(e,"x","tf.grad","string_or_numeric"),s=n!=null?d(n,"dy","tf.grad"):null;return S.tidy(()=>{const{value:a,grads:o}=S.gradients(()=>t(r),[r],s);return s!=null&&ge(a.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),ur(o),o[0]})}}function ay(t){return g(rt(t),()=>"The f passed in grads(f) must be a function"),(e,n)=>{g(Array.isArray(e),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");const r=an(e,"args","tf.grads","string_or_numeric"),s=n!=null?d(n,"dy","tf.grads"):null;return S.tidy(()=>{const{value:a,grads:o}=S.gradients(()=>t(...r),r,s);return s!=null&&ge(a.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),ur(o),o})}}function oy(t){return g(rt(t),()=>"The f passed in valueAndGrad(f) must be a function"),(e,n)=>{g(e instanceof ne,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),g(n==null||n instanceof ne,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");const{grads:r,value:s}=S.gradients(()=>t(e),[e],n);return ur(r),{grad:r[0],value:s}}}function iy(t){return g(rt(t),()=>"The f passed in valueAndGrads(f) must be a function"),(e,n)=>{g(Array.isArray(e)&&e.every(s=>s instanceof ne),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),g(n==null||n instanceof ne,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");const r=S.gradients(()=>t(...e),e,n);return n!=null&&ge(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),ur(r.grads),r}}function Lc(t,e){g(rt(t),()=>"The f passed in variableGrads(f) must be a function"),g(e==null||Array.isArray(e)&&e.every(l=>l instanceof sn),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const n=e!=null;if(!n){e=[];for(const l in S.registeredVariables)e.push(S.registeredVariables[l])}const r=n?e.filter(l=>!l.trainable):null,s=e.length;e=e.filter(l=>l.trainable),g(e.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`);const a=!0,{value:o,grads:i}=S.gradients(t,e,null,a);g(i.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),g(o.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${o.rank} tensor`);const u={};return e.forEach((l,h)=>{i[h]!=null&&(u[l.name]=i[h])}),r!=null&&r.forEach(l=>u[l.name]=null),{value:o,grads:u}}function Ve(t){return S.customGrad(t)}function ur(t){if(t.filter(n=>n==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uy(t){const n={x:d(t,"x","neg")};return S.runKernel(Yi,n)}const Fe=N({neg_:uy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ly(t){const n={x:d(t,"x","softplus")};return S.runKernel(Cu,n)}const zs=N({softplus_:ly});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cy(t){const e=d(t,"x","logSigmoid");return Ve(r=>({value:Fe(zs(Fe(r))),gradFunc:o=>F(o,wt(Fe(r)))}))(e)}const Bc=N({logSigmoid_:cy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hy(t,e){let n=d(t,"a","sub"),r=d(e,"b","sub");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(Ju,s)}const j=N({sub_:hy});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function py(t,e=-1){const n=d(t,"logits","logSoftmax");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${e}`);return Ve((s,a)=>{const i=Nt(s,e,!0),u=j(s,i),l=j(J(u,"float32"),zt(X(it(u),e,!0)));return a([l]),{value:l,gradFunc:(c,f)=>{const[m]=f,b=!0,T=it(m);return j(c,F(X(c,e,b),T))}}})(n)}const zc=N({logSoftmax_:py});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fy(t,e=null,n=!1){const r=d(t,"x","logSumExp"),s=dn(e,r.shape),a=Nt(r,s,!0),o=j(r,a),i=it(o),u=X(i,s),l=zt(u),h=L(I(a,l.shape),l);if(n){const c=$n(h.shape,s);return I(h,c)}return h}const Vs=N({logSumExp_:fy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function my(t,e){const n=d(t,"a","logicalAnd","bool"),r=d(e,"b","logicalAnd","bool");se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Pi,s)}const cn=N({logicalAnd_:my});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dy(t){const n={x:d(t,"x","logicalNot","bool")};return S.runKernel(Li,n)}const js=N({logicalNot_:dy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gy(t,e){const n=d(t,"a","logicalOr","bool"),r=d(e,"b","logicalOr","bool");se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Bi,s)}const Ms=N({logicalOr_:gy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yy(t,e){const n=d(t,"a","logicalXor","bool"),r=d(e,"b","logicalXor","bool");return se(n.shape,r.shape),cn(Ms(t,e),js(cn(t,e)))}const Vc=N({logicalXor_:yy});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const An=2147483648;function by(t,e,n="left"){const r=d(t,"sortedSequence","searchSorted"),s=d(e,"values","searchSorted"),a=r.shape[r.shape.length-1],o=s.shape[s.shape.length-1],i=I(r,[-1,a]),u=I(s,[-1,o]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==u.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(G(u.shape)>=An)throw new Error(`values tensor size must less than ${An}`);if(i.shape[1]>=An)throw new Error(`trailing dim_size must less than ${An} for int32 output type, was ${i.shape[1]}`);const l={sortedSequence:i,values:u},h={side:n};return S.runKernel(vu,l,h)}const lr=N({searchSorted_:by});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jc(t,e){return lr(t,e,"left")}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wy(t,e,n,r,s){const a=d(t,"x","maxPool"),o=1;let i=a,u=!1;a.rank===3&&(u=!0,i=I(a,[1,a.shape[0],a.shape[1],a.shape[2]])),g(i.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${i.rank}.`),g(Xe(n,o),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),xe("maxPool",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s},c=S.runKernel(Mi,l,h);return u?I(c,[c.shape[1],c.shape[2],c.shape[3]]):c}const Ws=N({maxPool_:wy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ny(t,e=[1,1,1],n,r,s,a="NDHWC"){const o=d(t,"x","maxPool3d");let i=o,u=!1;o.rank===4&&(u=!0,i=I(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),g(i.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`),g(a==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`),xe("maxPool3d",r,s);const l={x:i},h={filterSize:e,strides:n,pad:r,dimRoundingMode:s,dataFormat:a},c=S.runKernel(Wi,l,h);return u?I(c,[c.shape[1],c.shape[2],c.shape[3],c.shape[4]]):c}const Mc=N({maxPool3d_:Ny});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sy(t,e,n,r,s=!1){const o={x:d(t,"x","maxPoolWithArgmax")},i={filterSize:e,strides:n,pad:r,includeBatchInIndex:s},u=S.runKernel(qi,o,i);return{result:u[0],indexes:u[1]}}const Wc=N({maxPoolWithArgmax_:Sy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ty(t,e){let n=d(t,"a","maximum"),r=d(e,"b","maximum");[n,r]=ee(n,r),n.dtype==="bool"&&(n=J(n,"int32"),r=J(r,"int32")),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(ji,s)}const qs=N({maximum_:Ty});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $y(t,e=null,n=!1){const s={x:d(t,"x","mean")},a={axis:e,keepDims:n};return S.runKernel(Ui,s,a)}const hn=N({mean_:$y});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kt(t,e="float32"){if($e(t),e==="complex64"){const r=kt(t,"float32"),s=kt(t,"float32");return Ke(r,s)}const n=rr(G(t),e);return S.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tt(t,e="float32"){if($e(t),e==="complex64"){const r=tt(t,"float32"),s=kt(t,"float32");return Ke(r,s)}const n=ls(G(t),e);return S.makeTensor(n,t,e)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qc(t,e,{indexing:n="xy"}={}){if(n!=="xy"&&n!=="ij")throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(t===void 0)return[];let r=d(t,"x","meshgrid",t instanceof ne?t.dtype:"float32");if(e===void 0)return[r];let s=d(e,"y","meshgrid",e instanceof ne?e.dtype:"float32");const a=G(r.shape),o=G(s.shape);return n==="xy"?(r=I(r,[1,-1]),s=I(s,[-1,1]),[q(tt([o,1],r.dtype),r),q(s,tt([1,a],s.dtype))]):(r=I(r,[-1,1]),s=I(s,[1,-1]),[q(r,tt([1,o],r.dtype)),q(tt([a,1],s.dtype),s)])}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ey(t,e){let n=d(t,"a","minimum"),r=d(e,"b","minimum");[n,r]=ee(n,r),n.dtype==="bool"&&(n=J(n,"int32"),r=J(r,"int32")),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Hi,s)}const pn=N({minimum_:Ey});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ky(t,e,n){g(n==="reflect"||n==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);const r=d(t,"x","mirrorPad");if(r.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");g(e.length===r.rank,()=>`Padding doesn't match input. Must be ${r.rank}. Got ${e.length}.`);const s=n==="reflect"?1:0;for(let i=0;i<r.rank;i++)g(e[i].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),g(e[i][0]>=0&&e[i][0]<=r.shape[i]-s&&e[i][1]>=0&&e[i][1]<=r.shape[i]-s,()=>`Padding in dimension ${i} cannot be greater than or equal to ${r.shape[i]-s} or less than 0 for input of shape ${r.shape}`);const a={paddings:e,mode:n},o={x:r};return S.runKernel(Ki,o,a)}const Uc=N({mirrorPad_:ky});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vy(t,e){let n=d(t,"a","mod"),r=d(e,"b","mod");[n,r]=ee(n,r);const s={a:n,b:r};return S.runKernel(Xi,s)}const Gc=N({mod_:vy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _y(t,e=null,n=!1){t=d(t,"x","moments");const r=dn(e,t.shape),s=hn(t,r,n);let a=s.shape;n||(a=$n(s.shape,r));const o=Ie(j(J(t,"float32"),I(s,a))),i=hn(o,r,n);return{mean:s,variance:i}}const Hc=N({moments_:_y});function Iy(t,e,n,r){const s=d(e,"data","multiRNNCell"),a=an(n,"c","multiRNNCell"),o=an(r,"h","multiRNNCell");let i=s;const u=[];for(let c=0;c<t.length;c++){const f=t[c](i,a[c],o[c]);u.push(f[0]),u.push(f[1]),i=f[1]}const l=[],h=[];for(let c=0;c<u.length;c+=2)l.push(u[c]),h.push(u[c+1]);return[l,h]}const Kc=N({multiRNNCell_:Iy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xy(t,e,n,r=!1){const s=d(t,"logits","multinomial"),a=s.size,o=s.rank;if(a<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${a}.`);if(o>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n=n||Math.random();const u={logits:o===1?I(s,[1,-1]):s},l={numSamples:e,seed:n,normalized:r},h=S.runKernel(Zi,u,l);return o===1?I(h,[h.size]):h}const Xc=N({multinomial_:xy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ay(t,e){let n=d(t,"a","notEqual","string_or_numeric"),r=d(e,"b","notEqual","string_or_numeric");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r};return S.runKernel(Qi,s)}const Us=N({notEqual_:Ay});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Oy(t,e,n=1,r=0,s="int32"){if(e<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${e}`);const o={indices:d(t,"indices","oneHot","int32")},i={dtype:s,depth:e,onValue:n,offValue:r};return S.runKernel(su,o,i)}const Qn=N({oneHot_:Oy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dy(t){const n={x:d(t,"x","onesLike")};return S.runKernel(ru,n)}const Zc=N({onesLike_:Dy});function Fy(t,e){const n=d(t,"v1","outerProduct"),r=d(e,"v2","outerProduct");g(n.rank===1&&r.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`);const s=I(n,[-1,1]),a=I(r,[1,-1]);return q(s,a)}const Jc=N({outerProduct_:Fy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cy(t,e,n=0){const r=d(t,"x","pad");if(r.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:e,constantValue:n},a={x:r};return S.runKernel(ou,a,s)}const Ut=N({pad_:Cy});function Ry(t,e,n=0){return g(e.length===2,()=>"Invalid number of paddings. Must be length of 2."),Ut(t,[e],n)}const Yc=N({pad1d_:Ry});function Py(t,e,n=0){return g(e.length===2&&e[0].length===2&&e[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Ut(t,e,n)}const Qc=N({pad2d_:Py});function Ly(t,e,n=0){return g(e.length===3&&e[0].length===2&&e[1].length===2&&e[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Ut(t,e,n)}const eh=N({pad3d_:Ly});function By(t,e,n=0){return g(e.length===4&&e[0].length===2&&e[1].length===2&&e[2].length===2&&e[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Ut(t,e,n)}const th=N({pad4d_:By});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zy(t,e,n){const r=d(t,"x","spaceToBatchND");g(r.rank>=1+e.length,()=>`input rank ${r.rank} should be > than [blockShape] ${e.length}`),g(n.length===e.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${e.length}`),g(r.shape.reduce((o,i,u)=>u>0&&u<=e.length?o&&(i+n[u-1][0]+n[u-1][1])%e[u-1]===0:o,!0),()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${e.toString()}`);const s={x:r},a={blockShape:e,paddings:n};return S.runKernel(Lu,s,a)}const Gs=N({spaceToBatchND_:zy});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vy(t,e,n,r,s,a,o){s==null&&(s=[1,1]),a==null&&(a=1),r===0&&(r="valid");const i=d(t,"x","maxPool");let u=i,l=!1;i.rank===3&&(l=!0,u=I(i,[1,i.shape[0],i.shape[1],i.shape[2]])),g(Xe(a,s),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${a} and dilations '${s}'`);const h=Kl(u.shape,e,a,s,r),c=[h.dilationHeight,h.dilationWidth];let f;r==="same"?f=My([h.filterHeight,h.filterWidth],c):f=[[0,0],[0,0]];const m=c[0]===1&&c[1]===1,[b,T]=jy([h.inHeight,h.inWidth],c,f),w=m?r:"valid",$=m?u:Gs(u,c,b),v=(n==="avg"?()=>vs($,e,a,w,o):()=>Ws($,e,a,w,o))(),_=m?v:_s(v,c,T);return l?I(_,[_.shape[1],_.shape[2],_.shape[3]]):_}function jy(t,e,n){const r=n.map(h=>h[0]),s=n.map(h=>h[1]),a=t.concat(r,s),o=e.map((h,c)=>(h-a[c]%h)%h),i=s.map((h,c)=>h+o[c]),u=e.map((h,c)=>[r[c],i[c]]),l=e.map((h,c)=>[0,o[c]]);return[u,l]}function My(t,e){const r=t.map((o,i)=>o+(o-1)*(e[i]-1)).map(o=>o-1),s=r.map(o=>Math.floor(o/2)),a=r.map((o,i)=>o-s[i]);return r.map((o,i)=>[s[i],a[i]])}const nh=N({pool_:Vy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wy(t,e){const n=d(t,"x","prelu"),r=d(e,"alpha","prelu"),s={x:n,alpha:r};return S.runKernel(uu,s)}const Hs=N({prelu_:Wy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qy(t,e=null,n=!1){let r=d(t,"x","prod");r.dtype==="bool"&&(r=J(r,"int32"));const s={x:r},a={axis:e,keepDims:n};return S.runKernel(lu,s,a)}const rh=N({prod_:qy});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uy(t,e,n,r){const s=t.map((h,c)=>d(h,`tensors${c}`,"raggedGather","int32")),a=d(e,"paramsDenseValues","raggedGather"),o=d(n,"indices","raggedGather","int32"),i={paramsNestedSplits:s,paramsDenseValues:a,indices:o},u={outputRaggedRank:r},l=S.runKernel(cu,i,u);return{outputNestedSplits:l.slice(0,l.length-1),outputDenseValues:l[l.length-1]}}const sh=N({raggedGather_:Uy});/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gy(t,e,n){const r=d(t,"starts","raggedRange"),s=d(e,"limits","raggedRange",r.dtype),a=d(n,"deltas","raggedRange",r.dtype),o={starts:r,limits:s,deltas:a},i=S.runKernel(hu,o);return{rtNestedSplits:i[0],rtDenseValues:i[1]}}const ah=N({raggedRange_:Gy});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hy(t,e,n,r,s){const a=d(t,"shape","raggedTensorToTensor","int32"),o=d(e,"values","raggedTensorToTensor"),i=d(n,"defaultValue","raggedTensorToTensor",o.dtype),u=r.map((c,f)=>d(c,`tensors${f}`,"raggedTensorToTensor","int32")),l={shape:a,values:o,defaultValue:i,rowPartitionTensors:u},h={rowPartitionTypes:s};return S.runKernel(pu,l,h)}const oh=N({raggedTensorToTensor_:Hy});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ky(t,e,n){$e(t);const r=G(t);let s=null;if(n==null||n==="float32")s=new Float32Array(r);else if(n==="int32")s=new Int32Array(r);else if(n==="bool")s=new Uint8Array(r);else throw new Error(`Unknown data type ${n}`);for(let a=0;a<r;a++)s[a]=e();return S.makeTensor(s,t,n)}const ih=N({rand_:Ky});var Rn={exports:{}},Xy=Rn.exports,Oa;function Zy(){return Oa||(Oa=1,(function(t){(function(e,n,r){function s(u){var l=this,h=i();l.next=function(){var c=2091639*l.s0+l.c*23283064365386963e-26;return l.s0=l.s1,l.s1=l.s2,l.s2=c-(l.c=c|0)},l.c=1,l.s0=h(" "),l.s1=h(" "),l.s2=h(" "),l.s0-=h(u),l.s0<0&&(l.s0+=1),l.s1-=h(u),l.s1<0&&(l.s1+=1),l.s2-=h(u),l.s2<0&&(l.s2+=1),h=null}function a(u,l){return l.c=u.c,l.s0=u.s0,l.s1=u.s1,l.s2=u.s2,l}function o(u,l){var h=new s(u),c=l&&l.state,f=h.next;return f.int32=function(){return h.next()*4294967296|0},f.double=function(){return f()+(f()*2097152|0)*11102230246251565e-32},f.quick=f,c&&(typeof c=="object"&&a(c,h),f.state=function(){return a(h,{})}),f}function i(){var u=4022871197,l=function(h){h=String(h);for(var c=0;c<h.length;c++){u+=h.charCodeAt(c);var f=.02519603282416938*u;u=f>>>0,f-=u,f*=u,u=f>>>0,f-=u,u+=f*4294967296}return(u>>>0)*23283064365386963e-26};return l}n&&n.exports?n.exports=o:this.alea=o})(Xy,t)})(Rn)),Rn.exports}var Pn={exports:{}},Jy=Pn.exports,Da;function Yy(){return Da||(Da=1,(function(t){(function(e,n,r){function s(i){var u=this,l="";u.x=0,u.y=0,u.z=0,u.w=0,u.next=function(){var c=u.x^u.x<<11;return u.x=u.y,u.y=u.z,u.z=u.w,u.w^=u.w>>>19^c^c>>>8},i===(i|0)?u.x=i:l+=i;for(var h=0;h<l.length+64;h++)u.x^=l.charCodeAt(h)|0,u.next()}function a(i,u){return u.x=i.x,u.y=i.y,u.z=i.z,u.w=i.w,u}function o(i,u){var l=new s(i),h=u&&u.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var f=l.next()>>>11,m=(l.next()>>>0)/4294967296,b=(f+m)/(1<<21);while(b===0);return b},c.int32=l.next,c.quick=c,h&&(typeof h=="object"&&a(h,l),c.state=function(){return a(l,{})}),c}n&&n.exports?n.exports=o:this.xor128=o})(Jy,t)})(Pn)),Pn.exports}var Ln={exports:{}},Qy=Ln.exports,Fa;function eb(){return Fa||(Fa=1,(function(t){(function(e,n,r){function s(i){var u=this,l="";u.next=function(){var c=u.x^u.x>>>2;return u.x=u.y,u.y=u.z,u.z=u.w,u.w=u.v,(u.d=u.d+362437|0)+(u.v=u.v^u.v<<4^(c^c<<1))|0},u.x=0,u.y=0,u.z=0,u.w=0,u.v=0,i===(i|0)?u.x=i:l+=i;for(var h=0;h<l.length+64;h++)u.x^=l.charCodeAt(h)|0,h==l.length&&(u.d=u.x<<10^u.x>>>4),u.next()}function a(i,u){return u.x=i.x,u.y=i.y,u.z=i.z,u.w=i.w,u.v=i.v,u.d=i.d,u}function o(i,u){var l=new s(i),h=u&&u.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var f=l.next()>>>11,m=(l.next()>>>0)/4294967296,b=(f+m)/(1<<21);while(b===0);return b},c.int32=l.next,c.quick=c,h&&(typeof h=="object"&&a(h,l),c.state=function(){return a(l,{})}),c}n&&n.exports?n.exports=o:this.xorwow=o})(Qy,t)})(Ln)),Ln.exports}var Bn={exports:{}},tb=Bn.exports,Ca;function nb(){return Ca||(Ca=1,(function(t){(function(e,n,r){function s(i){var u=this;u.next=function(){var h=u.x,c=u.i,f,m;return f=h[c],f^=f>>>7,m=f^f<<24,f=h[c+1&7],m^=f^f>>>10,f=h[c+3&7],m^=f^f>>>3,f=h[c+4&7],m^=f^f<<7,f=h[c+7&7],f=f^f<<13,m^=f^f<<9,h[c]=m,u.i=c+1&7,m};function l(h,c){var f,m=[];if(c===(c|0))m[0]=c;else for(c=""+c,f=0;f<c.length;++f)m[f&7]=m[f&7]<<15^c.charCodeAt(f)+m[f+1&7]<<13;for(;m.length<8;)m.push(0);for(f=0;f<8&&m[f]===0;++f);for(f==8?m[7]=-1:m[f],h.x=m,h.i=0,f=256;f>0;--f)h.next()}l(u,i)}function a(i,u){return u.x=i.x.slice(),u.i=i.i,u}function o(i,u){i==null&&(i=+new Date);var l=new s(i),h=u&&u.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var f=l.next()>>>11,m=(l.next()>>>0)/4294967296,b=(f+m)/(1<<21);while(b===0);return b},c.int32=l.next,c.quick=c,h&&(h.x&&a(h,l),c.state=function(){return a(l,{})}),c}n&&n.exports?n.exports=o:this.xorshift7=o})(tb,t)})(Bn)),Bn.exports}var zn={exports:{}},rb=zn.exports,Ra;function sb(){return Ra||(Ra=1,(function(t){(function(e,n,r){function s(i){var u=this;u.next=function(){var h=u.w,c=u.X,f=u.i,m,b;return u.w=h=h+1640531527|0,b=c[f+34&127],m=c[f=f+1&127],b^=b<<13,m^=m<<17,b^=b>>>15,m^=m>>>12,b=c[f]=b^m,u.i=f,b+(h^h>>>16)|0};function l(h,c){var f,m,b,T,w,$=[],O=128;for(c===(c|0)?(m=c,c=null):(c=c+"\0",m=0,O=Math.max(O,c.length)),b=0,T=-32;T<O;++T)c&&(m^=c.charCodeAt((T+32)%c.length)),T===0&&(w=m),m^=m<<10,m^=m>>>15,m^=m<<4,m^=m>>>13,T>=0&&(w=w+1640531527|0,f=$[T&127]^=m+w,b=f==0?b+1:0);for(b>=128&&($[(c&&c.length||0)&127]=-1),b=127,T=512;T>0;--T)m=$[b+34&127],f=$[b=b+1&127],m^=m<<13,f^=f<<17,m^=m>>>15,f^=f>>>12,$[b]=m^f;h.w=w,h.X=$,h.i=b}l(u,i)}function a(i,u){return u.i=i.i,u.w=i.w,u.X=i.X.slice(),u}function o(i,u){i==null&&(i=+new Date);var l=new s(i),h=u&&u.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var f=l.next()>>>11,m=(l.next()>>>0)/4294967296,b=(f+m)/(1<<21);while(b===0);return b},c.int32=l.next,c.quick=c,h&&(h.X&&a(h,l),c.state=function(){return a(l,{})}),c}n&&n.exports?n.exports=o:this.xor4096=o})(rb,t)})(zn)),zn.exports}var Vn={exports:{}},ab=Vn.exports,Pa;function ob(){return Pa||(Pa=1,(function(t){(function(e,n,r){function s(i){var u=this,l="";u.next=function(){var c=u.b,f=u.c,m=u.d,b=u.a;return c=c<<25^c>>>7^f,f=f-m|0,m=m<<24^m>>>8^b,b=b-c|0,u.b=c=c<<20^c>>>12^f,u.c=f=f-m|0,u.d=m<<16^f>>>16^b,u.a=b-c|0},u.a=0,u.b=0,u.c=-1640531527,u.d=1367130551,i===Math.floor(i)?(u.a=i/4294967296|0,u.b=i|0):l+=i;for(var h=0;h<l.length+20;h++)u.b^=l.charCodeAt(h)|0,u.next()}function a(i,u){return u.a=i.a,u.b=i.b,u.c=i.c,u.d=i.d,u}function o(i,u){var l=new s(i),h=u&&u.state,c=function(){return(l.next()>>>0)/4294967296};return c.double=function(){do var f=l.next()>>>11,m=(l.next()>>>0)/4294967296,b=(f+m)/(1<<21);while(b===0);return b},c.int32=l.next,c.quick=c,h&&(typeof h=="object"&&a(h,l),c.state=function(){return a(l,{})}),c}n&&n.exports?n.exports=o:this.tychei=o})(ab,t)})(Vn)),Vn.exports}var jn={exports:{}};const ib={},ub=Object.freeze(Object.defineProperty({__proto__:null,default:ib},Symbol.toStringTag,{value:"Module"})),lb=is(ub);var cb=jn.exports,La;function hb(){return La||(La=1,(function(t){(function(e,n,r){var s=256,a=6,o=52,i="random",u=r.pow(s,a),l=r.pow(2,o),h=l*2,c=s-1,f;function m(_,x,D){var P=[];x=x==!0?{entropy:!0}:x||{};var C=$(w(x.entropy?[_,v(n)]:_??O(),3),P),k=new b(P),E=function(){for(var y=k.g(a),A=u,R=0;y<l;)y=(y+R)*s,A*=s,R=k.g(1);for(;y>=h;)y/=2,A/=2,R>>>=1;return(y+R)/A};return E.int32=function(){return k.g(4)|0},E.quick=function(){return k.g(4)/4294967296},E.double=E,$(v(k.S),n),(x.pass||D||function(y,A,R,z){return z&&(z.S&&T(z,k),y.state=function(){return T(k,{})}),R?(r[i]=y,A):y})(E,C,"global"in x?x.global:this==r,x.state)}function b(_){var x,D=_.length,P=this,C=0,k=P.i=P.j=0,E=P.S=[];for(D||(_=[D++]);C<s;)E[C]=C++;for(C=0;C<s;C++)E[C]=E[k=c&k+_[C%D]+(x=E[C])],E[k]=x;(P.g=function(y){for(var A,R=0,z=P.i,V=P.j,W=P.S;y--;)A=W[z=c&z+1],R=R*s+W[c&(W[z]=W[V=c&V+A])+(W[V]=A)];return P.i=z,P.j=V,R})(s)}function T(_,x){return x.i=_.i,x.j=_.j,x.S=_.S.slice(),x}function w(_,x){var D=[],P=typeof _,C;if(x&&P=="object")for(C in _)try{D.push(w(_[C],x-1))}catch{}return D.length?D:P=="string"?_:_+"\0"}function $(_,x){for(var D=_+"",P,C=0;C<D.length;)x[c&C]=c&(P^=x[c&C]*19)+D.charCodeAt(C++);return v(x)}function O(){try{var _;return f&&(_=f.randomBytes)?_=_(s):(_=new Uint8Array(s),(e.crypto||e.msCrypto).getRandomValues(_)),v(_)}catch{var x=e.navigator,D=x&&x.plugins;return[+new Date,e,D,e.screen,v(n)]}}function v(_){return String.fromCharCode.apply(0,_)}if($(r.random(),n),t.exports){t.exports=m;try{f=lb}catch{}}else r["seed"+i]=m})(typeof self<"u"?self:cb,[],Math)})(jn)),jn.exports}var vr,Ba;function pb(){if(Ba)return vr;Ba=1;var t=Zy(),e=Yy(),n=eb(),r=nb(),s=sb(),a=ob(),o=hb();return o.alea=t,o.xor128=e,o.xorwow=n,o.xorshift7=r,o.xor4096=s,o.tychei=a,vr=o,vr}var Ks=pb();/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fb=.001,uh=.1;function mb(t,e,n){return n==null&&(n=Xs()),Gr(t,e,(r,s)=>Zs(r,s,n))}function Xs(){return S.backend.floatPrecision()===32?fb:uh}function Gr(t,e,n){let r=!0;if((ie(t)||ie(e))&&(r=!1),ie(t)&&ie(e)&&(r=!0),r){const o=t.constructor.name,i=e.constructor.name;if(o!==i)throw new Error(`Arrays are of different type. Actual: ${o}. Expected: ${i}`)}if(Array.isArray(t)&&Array.isArray(e)){const o=Le(t),i=Le(e);if(!Ce(o,i))throw new Error(`Arrays have different shapes. Actual: [${o}]. Expected: [${i}]`)}const s=ie(t)?t:at(t),a=ie(e)?e:at(e);if(s.length!==a.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${a.length}.
Actual:   ${s}.
Expected: ${a}.`);for(let o=0;o<a.length;++o){const i=s[o],u=a[o];if(!n(i,u))throw new Error(`Arrays differ: actual[${o}] = ${i}, expected[${o}] = ${u}.
Actual:   ${s}.
Expected: ${a}.`)}typeof expect<"u"&&expect().nothing()}function db(t,e){t().then(()=>e.fail(),()=>e()),typeof expect<"u"&&expect().nothing()}function gb(t,e){const n=typeof e=="string"||typeof e=="number"||typeof e=="boolean"?[e]:e;return Qe(t)||Qe(t[0])||Qe(e)||Qe(e[0])?Gr(t,n,(r,s)=>r==s):Gr(t,e,(r,s)=>Zs(r,s,0))}function yb(t,e,n){if(n==null&&(n=Xs()),!Zs(t,e,n))throw new Error(`Numbers differ: actual === ${t}, expected === ${e}`);typeof expect<"u"&&expect().nothing()}function Zs(t,e,n){return!isFinite(t)&&!isFinite(e)?!0:!(isNaN(t)||isNaN(e)||Math.abs(t-e)>n)}function bb(t,e,n){for(let r=0;r<t.length;r++)if(t[r]<e||t[r]>n)throw new Error(`Value out of range:${t[r]} low: ${e}, high: ${n}`)}function wb(t,e){const n=new Float32Array(t),r=new Float32Array(e);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let s=0;s<r.length;s++)if(n[s]!==r[s])throw new Error(`Expected ArrayBuffer value at ${s} to be ${r[s]} but got ${n[s]} instead`)}function lh(t){for(let e=0;e<t.length;e++){const n=t[e];Array.isArray(n)?lh(n):t[e]=bn(n)}return t}function Nb(t){const e=document.createElement("video");return"playsInline"in e&&(e.playsInline=!0),e.muted=!0,e.loop=!0,e.style.position="fixed",e.style.left="0px",e.style.top="0px",e.preload="auto",e.appendChild(t),new Promise(n=>{e.addEventListener("loadeddata",r=>n(e)),e.load()})}async function Sb(t){await t.play(),"requestVideoFrameCallback"in t&&await new Promise(e=>{t.requestVideoFrameCallback(e)})}const Tb=Object.freeze(Object.defineProperty({__proto__:null,TEST_EPSILON_FLOAT16:uh,createVideoElement:Nb,encodeStrings:lh,expectArrayBuffersEqual:wb,expectArraysClose:mb,expectArraysEqual:gb,expectNumbersClose:yb,expectPromiseToFail:db,expectValuesInRange:bb,play:Sb,testEpsilon:Xs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Js{constructor(e,n,r,s,a){this.mean=e,this.stdDev=n,this.dtype=r,this.nextVal=NaN,this.truncated=s,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const o=a||Math.random();this.random=Ks.alea(o.toString())}nextValue(){if(!isNaN(this.nextVal)){const s=this.nextVal;return this.nextVal=NaN,s}let e,n,r=!1;for(;!r;){let s,a,o;do s=2*this.random()-1,a=2*this.random()-1,o=s*s+a*a;while(o>=1||o===0);const i=Math.sqrt(-2*Math.log(o)/o);e=this.mean+this.stdDev*s*i,n=this.mean+this.stdDev*a*i,(!this.truncated||this.isValidTruncated(e))&&(r=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(e)}convertValue(e){return this.dtype==null||this.dtype==="float32"?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class $b{constructor(e,n,r,s){this.alpha=e,this.beta=1/n,this.dtype=r;const a=s||Math.random();this.randu=Ks.alea(a.toString()),this.randn=new Js(0,1,r,!1,this.randu()),e<1?this.d=e+2/3:this.d=e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,n,r,s,a,o;for(;;){do s=this.randn.nextValue(),o=1+this.c*s;while(o<=0);if(o*=o*o,e=s*s,n=1-.331*e*e,r=.5*e+this.d*(1-o+Math.log(o)),a=this.randu(),a<n||Math.log(a)<r)break}return o=1/this.beta*this.d*o,this.alpha<1&&(o*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(o)}convertValue(e){return this.dtype==="float32"?e:Math.round(e)}}class Eb{constructor(e=0,n=1,r,s){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=e,this.range=n-e,this.dtype=r,s==null&&(s=Math.random()),typeof s=="number"&&(s=s.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${n} <= 1 and dtype is not float`);this.random=Ks.alea(s)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kb(t,e,n=1,r="float32",s){if($e(t),n==null&&(n=1),r==null&&(r="float32"),r!=="float32"&&r!=="int32")throw new Error(`Unsupported data type ${r}`);const a=new $b(e,n,r,s),o=Be(t,r);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const ch=N({randomGamma_:kb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vb(t,e=0,n=1,r,s){if($e(t),r!=null&&r==="bool")throw new Error(`Unsupported data type ${r}`);const a=new Js(e,n,r,!1,s),o=Be(t,r);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const Ys=N({randomNormal_:vb});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _b(t,e,n){if(e!=null&&e==="bool")throw new Error(`Unsupported data type ${e}`);return Ys(t,0,1,e,n)}const hh=N({randomStandardNormal_:_b});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ib(t,e=0,n=1,r="float32",s){$e(t);const a=Be(t,r),o=new Eb(e,n,null,s);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const cr=N({randomUniform_:Ib});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xb(t,e,n,r){return cr(t,e,n,"int32",r)}const ph=N({randomUniformInt_:xb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vt(t,e,n=1,r="float32"){if(n===0)throw new Error("Cannot have a step of zero");const s={start:t,stop:e,step:n,dtype:r};return S.runKernel(fu,{},s)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ab(t){const n={input:d(t,"input","real")};return S.runKernel(mu,n)}const jt=N({real_:Ab});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ob(t){const n={x:d(t,"x","reciprocal")};return S.runKernel(du,n)}const fh=N({reciprocal_:Ob});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Db(t){const n={x:d(t,"x","relu")};return S.runKernel(gu,n)}const _n=N({relu_:Db});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fb(t){const n={x:d(t,"x","relu6")};return S.runKernel(Nu,n)}const Qs=N({relu6_:Fb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cb(t,e){const r={x:d(t,"x","reverse")},s={dims:e};return S.runKernel(Su,r,s)}const ut=N({reverse_:Cb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rb(t){const e=d(t,"x","reverse");return g(e.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${e.rank}.`),ut(e,0)}const mh=N({reverse1d_:Rb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pb(t,e){const n=d(t,"x","reverse");return g(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),ut(n,e)}const dh=N({reverse2d_:Pb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lb(t,e){const n=d(t,"x","reverse");return g(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),ut(n,e)}const gh=N({reverse3d_:Lb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bb(t,e){const n=d(t,"x","reverse");return g(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),ut(n,e)}const yh=N({reverse4d_:Bb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zb(t){const n={x:d(t,"x","round")};return S.runKernel(Tu,n)}const ea=N({round_:zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vb(t){const n={x:d(t,"x","rsqrt","float32")};return S.runKernel($u,n)}const bh=N({rsqrt_:Vb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jb(t){const n={x:d(t,"x","selu")};return S.runKernel(Iu,n)}const wh=N({selu_:jb});function Mb(t,e,n,r,s,a=[1,1],o="NHWC"){const i=d(t,"x","separableConv2d"),u=d(e,"depthwiseFilter","separableConv2d"),l=d(n,"pointwiseFilter","separableConv2d");let h=i,c=!1;if(i.rank===3&&(c=!0,h=I(i,[1,i.shape[0],i.shape[1],i.shape[2]])),o==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");g(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),g(u.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${u.rank}.`),g(l.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${u.rank}.`),g(l.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${l.shape[0]}.`),g(l.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${l.shape[1]}.`);const f=u.shape[2],m=u.shape[3];g(l.shape[2]===f*m,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${f*m}, but got ${l.shape[2]}.`);const b=or(h,u,r,s,o,a),w=Tn(b,l,1,"valid",o);return c?I(w,[w.shape[1],w.shape[2],w.shape[3]]):w}const Nh=N({separableConv2d_:Mb});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Wb(t,e){const n=d(t,"x","setdiff1d"),r=d(e,"y","setdiff1d");g(n.dtype===r.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`),g(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),g(r.rank===1,()=>`y should be 1D tensor, but got y (${r.shape}).`);const s=await n.data(),a=await r.data(),o=new Set(a);let i=0;for(let h=0;h<s.length;h++)o.has(s[h])||i++;const u=new Kn([i],n.dtype),l=new Kn([i],"int32");for(let h=0,c=0;h<s.length;h++)o.has(s[h])||(u.values[c]=s[h],l.values[c]=h,c++);return[u.toTensor(),l.toTensor()]}const Sh=Wb;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qb(t){const n={x:d(t,"x","sign")};return S.runKernel(Du,n)}const Th=N({sign_:qb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ub(t){const n={x:d(t,"x","sin","float32")};return S.runKernel(Au,n)}const $h=N({sin_:Ub});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gb(t){const n={x:d(t,"x","sinh")};return S.runKernel(Ou,n)}const Eh=N({sinh_:Gb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hb(t,e,n){const r=d(t,"x","slice1d");return g(r.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`),H(r,[e],[n])}const kh=N({slice1d_:Hb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kb(t,e,n){const r=d(t,"x","slice2d");return g(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),H(r,e,n)}const vh=N({slice2d_:Kb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xb(t,e,n){const r=d(t,"x","slice3d");return g(r.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`),H(r,e,n)}const _h=N({slice3d_:Xb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zb(t,e,n){const r=d(t,"x","slice4d");return g(r.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`),H(r,e,n)}const Ih=N({slice4d_:Zb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jb(t,e=-1){const n=d(t,"logits","softmax","float32");if(e===-1&&(e=n.rank-1),e!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${e}`);const r={logits:n},s={dim:e};return S.runKernel(zu,r,s)}const xh=N({softmax_:Jb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yb(t){g(t.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${t.dtype}.`);const e={input:t};return S.runKernel(di,e)}const hr=N({fft_:Yb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qb(t){g(t.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${t.dtype}.`);const e={input:t};return S.runKernel(ki,e)}const fn=N({ifft_:Qb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e0(t){const e=t.shape[t.shape.length-1],n=t.size/e;let r;if(e<=2){const s=I(t,[n,e]);r=fn(s)}else{const s=[n,2*(e-1)],a=I(jt(t),[n,e]),o=I(vn(t),[n,e]),i=ut(H(a,[0,1],[n,e-2]),1),u=F(ut(H(o,[0,1],[n,e-2]),1),M(-1)),l=he([a,i],1),h=he([o,u],1),c=I(Ke(l,h),[s[0],s[1]]);r=fn(c)}if(r=jt(r),t.rank===3&&t.shape[0]!==0){const s=r,a=t.shape[0];r=I(r,[a,r.shape[0]/a,r.shape[1]]),s.dispose()}return r}const ta=N({irfft_:e0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function t0(t,e,n=0){const s={x:d(t,"x","split")},a={numOrSizeSplits:e,axis:n};return S.runKernel(Bu,s,a)}const Mt=N({split_:t0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function n0(t,e){g(t.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${t.dtype}`);let n=t.shape[t.shape.length-1];const r=t.size/n;let s;if(e!=null&&e<n){const b=t.shape.map(w=>0),T=t.shape.map(w=>w);T[t.shape.length-1]=e,s=H(t,b,T),n=e}else if(e!=null&&e>n){const b=t.shape.map(T=>T);b[t.shape.length-1]=e-n,s=he([t,kt(b)],t.shape.length-1),n=e}else s=t;const a=Te(s),o=I(Ke(s,a),[r,n]),i=hr(o),u=Math.floor(n/2)+1,l=jt(i),h=vn(i),c=Mt(l,[u,n-u],l.shape.length-1),f=Mt(h,[u,n-u],h.shape.length-1),m=s.shape.slice();return m[s.shape.length-1]=u,I(Ke(c[0],f[0]),m)}const pr=N({rfft_:n0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r0(t,e){let n=d(t,"a","squaredDifference"),r=d(e,"b","squaredDifference");[n,r]=ee(n,r),se(n.shape,r.shape);const s={a:n,b:r},a={};return S.runKernel(Uu,s,a)}const na=N({squaredDifference_:r0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function s0(t,e){const n=d(t,"x","squeeze","string_or_numeric");return I(n,uo(n.shape,e).newShape)}const fr=N({squeeze_:s0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function a0(t,e=0){const n=an(t,"tensors","stack","string_or_numeric");g(n.length>=1,()=>"Pass at least one tensor to tf.stack"),n.length>0&&g(e<=n[0].rank,()=>"Axis must be <= rank of the tensor");const r=n,s={axis:e};return S.runKernel(au,r,s)}const je=N({stack_:a0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function o0(t,e=0){const r={x:d(t,"x","step")},s={alpha:e};return S.runKernel(ol,r,s)}const ra=N({step_:o0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function i0(t,e,n,r,s=0,a=0,o=0,i=0,u=0){const h={x:d(t,"x","stridedSlice","string_or_numeric")},c={begin:e,end:n,strides:r,beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};return S.runKernel(Hu,h,c)}const Ah=N({stridedSlice_:i0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u0(t){const n={x:d(t,"x","tan","float32")};return S.runKernel(Yu,n)}const Oh=N({tan_:u0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ke(t,e){It(t);const n=Le(t,e);if(n.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return lt(t,null,n,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ct(t,e,n){if(It(t),e!=null&&e.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const r=Le(t,n);if(r.length!==2&&r.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return lt(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sa(t,e,n){if(It(t),e!=null&&e.length!==3)throw new Error("tensor3d() requires shape to have three numbers");const r=Le(t,n);if(r.length!==3&&r.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return lt(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dh(t,e,n){if(It(t),e!=null&&e.length!==4)throw new Error("tensor4d() requires shape to have four numbers");const r=Le(t,n);if(r.length!==4&&r.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return lt(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fh(t,e,n){if(It(t),e!=null&&e.length!==5)throw new Error("tensor5d() requires shape to have five numbers");const r=Le(t,n);if(r.length!==5&&r.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return lt(t,e,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ch(t,e,n){if(It(t),e!=null&&e.length!==6)throw new Error("tensor6d() requires shape to have six numbers");const r=Le(t,n);if(r.length!==6&&r.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(r.length===1&&e==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return e=e||r,lt(t,e,r,n)}function aa(t,e,n){const r=e.rank>1?e.shape[e.rank-1]:1,s=e.rank>1?e.rank-1:1,a=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${e.shape}, shape: ${t}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(a+` update.rank < ${s}. `);if(t.length<r+(n.rank-s))throw new Error(a+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+t.length-r)throw new Error(a+` update.rank != ${s+t.length-r}`);for(let o=0;o<s;++o)if(n.shape[o]!==e.shape[o])throw new Error(a+` updates.shape[${o}] (${n.shape[o]}) != indices.shape[${o}] (${e.shape[o]}).`);for(let o=0;o<n.rank-s;++o)if(n.shape[o+s]!==t[o+r])throw new Error(a+` updates.shape[${o+s}] (${n.shape[o+s]}) != shape[${o+s}] (${t[o+s]})`)}function mr(t,e,n){if(e.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${e.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(e.size===0)throw new Error(`Indices specified for empty output. indices shape: ${e.shape}`);if(t.size===0)throw new Error(`Updates specified for empty output. updates shape: ${t.shape}`)}aa(n,e,t)}function Rh(t,e,n){const r=e.shape.length,s=r>1?e.shape[r-1]:1,a=n.length;let o=1;for(let c=s;c<a;++c)o*=n[c];const i=s<1?1:s,u=G(e.shape)/i,l=[...Wt(n.slice(0,s)),1],h=G(n);return{sliceRank:s,numUpdates:u,sliceSize:o,strides:l,outputSize:h}}const l0=Object.freeze(Object.defineProperty({__proto__:null,calculateShapes:Rh,validateInput:mr,validateUpdateShape:aa},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function c0(t,e,n){const r=d(t,"tensor","tensorScatterupdate"),s=d(e,"indices","tensorScatterupdate","int32"),a=d(n,"updates","tensorScatterupdate");if(mr(a,s,r.shape),r.dtype!==a.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${r.dtype} and ${a.dtype}.`);const o={tensor:r,indices:s,updates:a},i={};return S.runKernel(ku,o,i)}const Ph=N({tensorScatterUpdate_:c0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function h0(t,e=1,n=!0){const r=d(t,"x","topk");if(r.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(e<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${e}`);if(e>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${e}`);const a={x:r},o={k:e,sorted:n},[i,u]=S.runKernel(el,a,o);return{values:i,indices:u}}const Lh=N({topk_:h0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function p0(t,e=0,n=1,r,s){if($e(t),r!=null&&r==="bool")throw new Error("Unsupported data type $ { dtype }");const a=new Js(e,n,r,!0,s),o=Be(t,r);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const Bh=N({truncatedNormal_:p0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f0(t,e=0){const n=d(t,"x","unique","string_or_numeric");g(n.rank>0,()=>"The input tensor must be at least 1D");const r={x:n},s={axis:e},[a,o]=S.runKernel(nl,r,s);return{values:a,indices:o}}const zh=N({unique_:f0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function m0(t,e,n){const r=d(t,"x","unsortedSegmentSum"),s=d(e,"segmentIds","unsortedSegmentSum","int32");g(Rt(n),()=>"numSegments must be of dtype int");const a={x:r,segmentIds:s},o={numSegments:n};return S.runKernel(sl,a,o)}const Vh=N({unsortedSegmentSum_:m0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function d0(t,e=0){const n=d(t,"x","unstack","string_or_numeric");g(e>=-n.shape.length&&e<n.shape.length,()=>`Axis = ${e} is not in [-${n.shape.length}, ${n.shape.length})`);const r={value:n},s={axis:e};return S.runKernel(rl,r,s)}const ct=N({unstack_:d0});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jh(t,e){return lr(t,e,"right")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mh(t,e=!0,n,r){return S.makeVariable(t,e,n,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wh(t,e){const n=[];for(let a=0;a<e.length;a++)e[a]&&n.push(a);const r=Be(t,"int32"),s=Be([n.length,t.length],"int32");for(let a=0;a<n.length;a++){const o=r.indexToLoc(n[a]),i=a*t.length;s.values.set(o,i)}return s.toTensor()}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function g0(t){const e=d(t,"condition","whereAsync","bool"),n=await e.data(),r=Wh(e.shape,n);return t!==e&&e.dispose(),r}const oa=g0;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function y0(t,e,n){const r=d(t,"tensor","boolMask"),s=d(e,"mask","boolMask","bool"),a=n??0,o=s.rank,i=r.shape;g(o>0,()=>"mask cannot be scalar"),ge(i.slice(a,a+o),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let u=1;for(let T=a;T<a+o;T++)u*=i[T];const l=i.slice(0,a).concat([u],i.slice(a+o)),h=I(r,l),c=I(s,[-1]),f=await oa(c),m=fr(f,[1]),b=Rs(h,m,a);return t!==r&&r.dispose(),e!==s&&s.dispose(),m.dispose(),h.dispose(),c.dispose(),f.dispose(),b}const qh=y0;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function b0(t,e,n){const r=d(t,"x","transpose");if(e==null&&(e=r.shape.map((o,i)=>i).reverse()),g(r.rank===e.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${e}.`),e.forEach(o=>{g(o>=0&&o<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${e}`)}),r.rank<=1)return r.clone();const s={x:r},a={perm:e};return r.dtype==="complex64"?U(()=>{let o=jt(r),i=vn(r);return o=S.runKernel(Dn,{x:o},a),i=S.runKernel(Dn,{x:i},a),n&&(i=Fe(i)),Ke(o,i)}):S.runKernel(Dn,s,a)}const mn=N({transpose_:b0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function w0(t,e,n,r,s=!0){const a=d(t,"v","movingAverage"),o=d(e,"x","movingAverage"),i=d(n,"decay","movingAverage");bl(a,o),g(Ce(a.shape,o.shape),()=>"Shape mismatch in v and x");const u=M(1),l=j(u,i);let h=F(j(o,a),l);if(s){g(r!=null,()=>"When using zeroDebias: true, step is required.");const c=d(r,"step","movingAverage");h=Z(h,j(u,Bt(i,c)))}return L(a,h)}const Uh=N({movingAverage_:w0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function N0(t,e,n){$e(n);const r=d(t,"indices","scatterND","int32"),s=d(e,"updates","scatterND");mr(s,r,n);const a={indices:r,updates:s},o={shape:n};return S.runKernel(Eu,a,o)}const Gh=N({scatterND_:N0});function S0(t,e,n,r){if(t.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${t.shape}.`);const s=t.rank>0?t.shape[0]:1,a=t.rank>1?t.shape[1]:1;if(n.length!==a)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${a}.`);const o=e.size;if(!(e.rank===0||e.rank===1&&o===s))throw new Error(`sparseValues has incorrect shape ${e.shape}, should be [] or [${s}]`);if(e.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function T0(t,e,n,r=0){$e(n);const s=d(t,"sparseIndices","sparseToDense","int32"),a=d(e,"sparseValues","sparseToDense","string_or_numeric"),o=d(r,"defaultValue","sparseToDense",a.dtype);S0(s,a,n,o);const i={sparseIndices:s,sparseValues:a,defaultValue:o},u={outputShape:n};return S.runKernel(qu,i,u)}const Hh=N({sparseToDense_:T0});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $0(t,e){const n=d(e,"indices","gatherND","int32"),s={params:d(t,"x","gatherND","string_or_numeric"),indices:n};return S.runKernel(Ti,s)}const Kh=N({gatherND_:$0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function E0(t,e){if(e==null)return t.shape.slice();if(Ce(t.shape,e))return e;if(t.shape.length===e.length){const n=[];for(let r=0;r<t.shape.length;r++)e[r]==null&&t.shape[r]!=null?n.push(t.shape[r]):n.push(e[r]);return n}return e}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function k0(t,e,n,r){const s=d(t,"x","dropout");if(g(s.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`),g(e>=0&&e<1,()=>`rate must be a float in the range [0, 1), but got ${e}.`),e===0)return t instanceof ne?s.clone():s;const a=E0(s,n),o=1-e,i=Z(Cs(L(cr(a,0,1,"float32",r),o)),o);return F(s,i)}const Xh=N({dropout_:k0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ia(t){return Math.floor(Math.pow(2,Math.ceil(Math.log(t)/Math.log(2))))}function dr(t,e,n){const r=1-t%2,s=new Float32Array(t);for(let a=0;a<t;++a){const o=2*Math.PI*a/(t+r-1);s[a]=e-n*Math.cos(o)}return ke(s,"float32")}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function v0(t,e,n=1){const r=d(t,"predictions","inTopK"),s=d(e,"targets","inTopK");g(r.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`),g(r.rank-1===s.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`),ge(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const a=r.shape[r.shape.length-1];g(n>0&&n<=a,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${n}`);const o=await r.data(),i=await s.data(),[u,l]=[o.length/a,a],h=lo("bool",u);for(let c=0;c<u;c++){const f=c*l,m=o.subarray(f,f+l),b=[];for(let T=0;T<m.length;T++)b.push({value:m[T],index:T});b.sort((T,w)=>w.value-T.value),h[c]=0;for(let T=0;T<n;T++)if(b[T].index===i[c]){h[c]=1;break}}return t!==r&&r.dispose(),e!==s&&s.dispose(),De(h,s.shape,"bool")}const Zh=v0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _0(t,e,n,r,s,a="NHWC",o){let i=t;t.rank===3&&(i=I(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u=e;u.rank===3&&(u=I(e,[1,e.shape[0],e.shape[1],e.shape[2]])),g(i.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`),g(u.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${u.shape}.`),g(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);const l=a==="NHWC"?i.shape[3]:i.shape[1],h=a==="NHWC"?u.shape[3]:u.shape[1];g(l===n[2],()=>`Error in conv2dDerFilter: depth of input ${l}) must match input depth in filter (${n[2]}.`),g(h===n[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${n[3]}).`),xe("conv2dDerFilter",s,o);const c={x:i,dy:u},f={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,filterShape:n};return S.runKernel(Uo,c,f)}const I0=N({conv2DBackpropFilter_:_0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gr(t,e,n){if(n==null||n==="linear")return t;if(n==="relu")return F(t,ra(e));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function yr(t,e){let n=e;const r=xs(t.shape,e.shape);return r.length>0&&(n=X(n,r)),I(n,t.shape)}function br(t,e,n,r){if(e==="linear")return t;if(e==="relu")return _n(t);if(e==="elu")return Os(t);if(e==="relu6")return Qs(t);if(e==="prelu")return Hs(t,n);if(e==="leakyrelu")return Ls(t,r);if(e==="sigmoid")return wt(t);throw new Error(`Unknown fused activation ${e}.`)}const wr=(t,e)=>!(t>0)||e==="linear";/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function x0({x:t,filter:e,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(u=u||"linear",wr(S.state.gradientDepth,u)===!1){g(s==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let D=Tn(t,e,n,r,s,a,o);return i!=null&&(D=L(D,i)),br(D,u,l,h)}const c=d(t,"x","conv2d","float32"),f=d(e,"filter","conv2d","float32");let m=c,b=!1;c.rank===3&&(b=!0,m=I(c,[1,c.shape[0],c.shape[1],c.shape[2]])),g(m.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${m.rank}.`),g(f.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${f.rank}.`),xe("fused conv2d",r,o);const T=s==="NHWC"?m.shape[3]:m.shape[1];g(f.shape[2]===T,()=>`Error in conv2d: depth of input (${T}) must match input depth for filter ${f.shape[2]}.`),g(Xe(n,a),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);const w=Nn(m.shape,f.shape,n,a,r,o);let $;i!=null&&($=d(i,"bias","fused conv2d"),[$]=ee($,c),s==="NHWC"?se(w.outShape,$.shape):(g($.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${$.shape.length}.`),g($.shape.length===0||$.shape[0]===w.outChannels||$.shape[0]===1,()=>`Error in fused conv2d: bias shape (${$.shape}) is not compatible with the number of output channels (${w.outChannels})`)));let O;if(l!=null){const D=l.shape;if(g(D.length<=1||D.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${D.length}.`),D.length===1)g(D[0]===1||D[0]===w.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${D}) is not compatible with the number of output channels (${w.outChannels}).`);else if(D.length===3)try{se(D,w.outShape)}catch{const C=`Error in fused conv2d: PReLU activation weights (${D}) is not compatible with the output shape of the conv2d (${w.outShape}).`;throw Error(C)}O=d(l,"prelu weights","fused conv2d")}const v=(D,P)=>{g(s==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`);const[C,k,E,y]=P,A=gr(D,E,u);g(ln(a),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${a}'`);const R=hc(k.shape,A,C,n,r),z=I0(k,A,C.shape,n,r),V=[R,z];if(y!=null){const W=yr(y,A);V.push(W)}return V},_={x:m,filter:f,bias:$,preluActivationWeights:O},x={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:h};return i==null?Ve((P,C,k)=>{let E=S.runKernel(Dr,_,x);return k([C,P,E]),b&&(E=I(E,[E.shape[1],E.shape[2],E.shape[3]])),{value:E,gradFunc:v}})(m,f):Ve((P,C,k,E)=>{let y=S.runKernel(Dr,_,x);return E([C,P,y,k]),b&&(y=I(y,[y.shape[1],y.shape[2],y.shape[3]])),{value:y,gradFunc:v}})(m,f,$)}const A0=N({fusedConv2d_:x0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function O0(t,e,n,r,s,a=[1,1],o){let i=t;t.rank===3&&(i=I(t,[1,t.shape[0],t.shape[1],t.shape[2]]));let u=e;u.rank===3&&(u=I(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={x:i,dy:u},h={strides:r,pad:s,dimRoundingMode:o,dilations:a,filterShape:n};return S.runKernel(ri,l,h)}const D0=N({depthwiseConv2dNativeBackpropFilter_:O0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function F0(t,e,n,r,s,a=[1,1],o){let i=e,u=!1;e.rank===3&&(u=!0,i=I(e,[1,e.shape[0],e.shape[1],e.shape[2]]));const l={dy:i,filter:n},h={strides:r,pad:s,dimRoundingMode:o,dilations:a,inputShape:t},c=S.runKernel(si,l,h);return u?I(c,[c.shape[1],c.shape[2],c.shape[3]]):c}const C0=N({depthwiseConv2dNativeBackpropInput_:F0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function R0({x:t,filter:e,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:h}){if(wr(S.state.gradientDepth,u)===!1){let x=or(t,e,n,r,s,a,o);return i!=null&&(x=L(x,i)),br(x,u,l,h)}const c=d(t,"x","depthwiseConv2d","float32"),f=d(e,"filter","depthwiseConv2d","float32");let m=c,b=!1;c.rank===3&&(b=!0,m=I(c,[1,c.shape[0],c.shape[1],c.shape[2]])),g(m.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${m.rank}.`),g(f.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${f.rank}.`),g(m.shape[3]===f.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${m.shape[3]}) must match the inChannels dimension in filter ${f.shape[2]}.`),a==null&&(a=[1,1]),g(Xe(n,a),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),xe("fused depthwiseConv2d",r,o);const T=Nn(m.shape,f.shape,n,a,r,o,!0);let w;i!=null&&(w=d(i,"bias","fused conv2d"),[w]=ee(w,c),se(T.outShape,w.shape));let $;l!=null&&($=d(l,"prelu weights","fused depthwiseConv2d"));const O=(x,D)=>{g(ln(a),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`);const[P,C,k,E]=D,y=gr(x,k,u),A=C0(C.shape,y,P,n,r,a,o),R=D0(C,y,P.shape,n,r,a,o);if(E!=null){const z=yr(w,y);return[A,R,z]}return[A,R]},v={x:m,filter:f,bias:w,preluActivationWeights:$},_={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:h};return i==null?Ve((D,P,C)=>{let k=S.runKernel(Fr,v,_);return C([P,D,k]),b&&(k=I(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:O}})(m,f):Ve((D,P,C,k)=>{let E=S.runKernel(Fr,v,_);return k([P,D,E,C]),b&&(E=I(E,[E.shape[1],E.shape[2],E.shape[3]])),{value:E,gradFunc:O}})(m,f,w)}const P0=N({fusedDepthwiseConv2d_:R0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function L0({a:t,b:e,transposeA:n=!1,transposeB:r=!1,bias:s,activation:a="linear",preluActivationWeights:o,leakyreluAlpha:i=.2}){if(wr(S.state.gradientDepth,a)===!1){let y=q(t,e,n,r);return s!=null&&(y=L(y,s)),br(y,a,o,i)}let u=d(t,"a","fused matMul"),l=d(e,"b","fused matMul");[u,l]=ee(u,l);const h=n?u.shape[u.rank-2]:u.shape[u.rank-1],c=r?l.shape[l.rank-1]:l.shape[l.rank-2],f=n?u.shape[u.rank-1]:u.shape[u.rank-2],m=r?l.shape[l.rank-2]:l.shape[l.rank-1],b=u.shape.slice(0,-2),T=l.shape.slice(0,-2),w=G(b),$=G(T);g(h===c,()=>`Error in fused matMul: inner shapes (${h}) and (${c}) of Tensors with shapes ${u.shape} and ${l.shape} and transposeA=${n} and transposeB=${r} must match.`);const v=se(u.shape.slice(0,-2),l.shape.slice(0,-2)).concat([f,m]),_=n?I(u,[w,h,f]):I(u,[w,f,h]),x=r?I(l,[$,m,c]):I(l,[$,c,m]);let D;s!=null&&(D=d(s,"bias","fused matMul"),[D]=ee(D,u),se(v,D.shape));let P;o!=null&&(P=d(o,"prelu weights","fused matMul"));const C=(y,A)=>{const[R,z,V,W]=A,Y=gr(I(y,V.shape),V,a);let ae,te;if(!n&&!r?(ae=q(Y,z,!1,!0),te=q(R,Y,!0,!1)):!n&&r?(ae=q(Y,z,!1,!1),te=q(Y,R,!0,!1)):n&&!r?(ae=q(z,Y,!1,!0),te=q(R,Y,!1,!1)):(ae=q(z,Y,!0,!0),te=q(Y,R,!0,!0)),s!=null){const re=yr(W,Y);return[ae,te,re]}else return[ae,te]},k={a:_,b:x,bias:D,preluActivationWeights:P},E={transposeA:n,transposeB:r,activation:a,leakyreluAlpha:i};return s==null?Ve((A,R,z)=>{const V=S.runKernel(Or,k,E);return z([A,R,V]),{value:I(V,v),gradFunc:C}})(_,x):Ve((A,R,z,V)=>{const W=S.runKernel(Or,k,E);return V([A,R,W,z]),{value:I(W,v),gradFunc:C}})(_,x,D)}const B0=N({fusedMatMul_:L0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Jh=Object.freeze(Object.defineProperty({__proto__:null,conv2d:A0,depthwiseConv2d:P0,matMul:B0},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function z0(t){return dr(t,.54,.46)}const V0=N({hammingWindow_:z0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function j0(t){return dr(t,.5,.5)}const Yh=N({hannWindow_:j0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function M0(t,e,n,r=!1,s=0){let a=0;const o=[];for(;a+e<=t.size;)o.push(H(t,a,e)),a+=n;if(r)for(;a<t.size;){const i=a+e-t.size,u=he([H(t,a,e-i),qt([i],s)]);o.push(u),a+=n}return o.length===0?Ct([],[0,e]):I(he(o),[o.length,e])}const Qh=N({frame_:M0});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function W0(t,e,n,r,s=Yh){r==null&&(r=ia(e));const a=Qh(t,e,n),o=F(a,s(e));return pr(o,r)}const q0=N({stft_:W0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function U0(t,e,n,r,s="bilinear",a=0){const o=d(t,"image","cropAndResize"),i=d(e,"boxes","cropAndResize","float32"),u=d(n,"boxInd","cropAndResize","int32"),l=i.shape[0];g(o.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`),g(i.rank===2&&i.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${l},4] but had shape ${i.shape}.`),g(u.rank===1&&u.shape[0]===l,()=>`Error in cropAndResize: boxInd must be have size [${l}] but had shape ${i.shape}.`),g(r.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`),g(r[0]>=1&&r[1]>=1,()=>`cropSize must be atleast [1,1], but was ${r}`),g(s==="bilinear"||s==="nearest",()=>`method must be bilinear or nearest, but was ${s}`);const h={image:o,boxes:i,boxInd:u},c={method:s,extrapolationValue:a,cropSize:r};return S.runKernel(Qo,h,c)}const G0=N({cropAndResize_:U0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function H0(t){const e=d(t,"image","flipLeftRight","float32");g(e.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${e.rank}.`);const n={image:e};return S.runKernel(yi,n,{})}const K0=N({flipLeftRight_:H0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function X0(t){const e=d(t,"image","grayscaleToRGB"),n=e.rank-1,r=e.shape[n];g(e.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${e.rank}.`),g(r===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`);const s=new Array(e.rank);return s.fill(1,0,n),s[n]=3,Ft(e,s)}const Z0=N({grayscaleToRGB_:X0});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function J0(t){const e=d(t,"image","RGBToGrayscale"),n=e.rank-1,r=e.shape[n];g(e.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${e.rank}.`),g(r===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${r}.`);const s=e.dtype,a=J(e,"float32"),o=ke([.2989,.587,.114]);let i;switch(e.rank){case 2:i=dt("ij,j->i",a,o);break;case 3:i=dt("ijk,k->ij",a,o);break;case 4:i=dt("ijkl,l->ijk",a,o);break;case 5:i=dt("ijklm,m->ijkl",a,o);break;case 6:i=dt("ijklmn,n->ijklm",a,o);break;default:throw new Error("Not a valid tensor rank.")}return i=Me(i,-1),J(i,s)}const Y0=N({rgbToGrayscale_:J0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Q0(t,e,n=0,r=.5){const s=d(t,"image","rotateWithOffset","float32");g(s.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`);const a={image:s},o={radians:e,fillValue:n,center:r};return S.runKernel(il,a,o)}const ew=N({rotateWithOffset_:Q0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gt(t,e,n,r,s,a){r==null&&(r=.5),s==null&&(s=Number.NEGATIVE_INFINITY),a==null&&(a=0);const o=t.shape[0];return n=Math.min(n,o),g(0<=r&&r<=1,()=>`iouThreshold must be in [0, 1], but was '${r}'`),g(t.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${t.rank}'`),g(t.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${t.shape[1]}`),g(e.rank===1,()=>"scores must be a 1D tensor"),g(e.shape[0]===o,()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${e.shape[0]}`),g(0<=a&&a<=1,()=>`softNmsSigma must be in [0, 1], but was '${a}'`),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:a}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=d(t,"boxes","nonMaxSuppression","float32"),o=d(e,"scores","nonMaxSuppression","float32"),i=Gt(a,o,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const u={maxOutputSize:n,iouThreshold:r,scoreThreshold:s};return S.runKernel(eu,{boxes:a,scores:o},u)}const nw=N({nonMaxSuppression_:tw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rw(t,e,n){const r=sw(t,e,n),s=r<0?-(r+1):r;t.splice(s,0,e)}function sw(t,e,n){return ow(t,e,n||aw)}function aw(t,e){return t>e?1:t<e?-1:0}function ow(t,e,n){let r=0,s=t.length,a=0,o=!1;for(;r<s;){a=r+(s-r>>>1);const i=n(e,t[a]);i>0?r=a+1:(s=a,o=!i)}return o?r:-r-1}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ep(t,e,n,r,s){return ua(t,e,n,r,s,0)}function tp(t,e,n,r,s,a){return ua(t,e,n,r,s,0,!1,a,!0)}function np(t,e,n,r,s,a){return ua(t,e,n,r,s,a,!0)}function ua(t,e,n,r,s,a,o=!1,i=!1,u=!1){const l=[];for(let w=0;w<e.length;w++)e[w]>s&&l.push({score:e[w],boxIndex:w,suppressBeginIndex:0});l.sort(za);const h=a>0?-.5/a:0,c=[],f=[];for(;c.length<n&&l.length>0;){const w=l.pop(),{score:$,boxIndex:O,suppressBeginIndex:v}=w;if($<s)break;let _=!1;for(let x=c.length-1;x>=v;--x){const D=iw(t,O,c[x]);if(D>=r){_=!0;break}if(w.score=w.score*uw(r,h,D),w.score<=s)break}w.suppressBeginIndex=c.length,_||(w.score===$?(c.push(O),f.push(w.score)):w.score>s&&rw(l,w,za))}const m=c.length,b=n-m;i&&b>0&&(c.push(...new Array(b).fill(0)),f.push(...new Array(b).fill(0)));const T={selectedIndices:c};return o&&(T.selectedScores=f),u&&(T.validOutputs=m),T}function iw(t,e,n){const r=t.subarray(e*4,e*4+4),s=t.subarray(n*4,n*4+4),a=Math.min(r[0],r[2]),o=Math.min(r[1],r[3]),i=Math.max(r[0],r[2]),u=Math.max(r[1],r[3]),l=Math.min(s[0],s[2]),h=Math.min(s[1],s[3]),c=Math.max(s[0],s[2]),f=Math.max(s[1],s[3]),m=(i-a)*(u-o),b=(c-l)*(f-h);if(m<=0||b<=0)return 0;const T=Math.max(a,l),w=Math.max(o,h),$=Math.min(i,c),O=Math.min(u,f),v=Math.max($-T,0)*Math.max(O-w,0);return v/(m+b-v)}function uw(t,e,n){const r=Math.exp(e*n*n);return n<=t?r:0}function za(t,e){return t.score-e.score||t.score===e.score&&e.boxIndex-t.boxIndex}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function lw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=d(t,"boxes","nonMaxSuppressionAsync"),o=d(e,"scores","nonMaxSuppressionAsync"),i=Gt(a,o,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const u=await Promise.all([a.data(),o.data()]),l=u[0],h=u[1],{selectedIndices:c}=ep(l,h,n,r,s);return a!==t&&a.dispose(),o!==e&&o.dispose(),ke(c,"int32")}const cw=lw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=d(t,"boxes","nonMaxSuppression"),i=d(e,"scores","nonMaxSuppression"),u=Gt(o,i,n,r,s,a);n=u.maxOutputSize,r=u.iouThreshold,s=u.scoreThreshold,a=u.softNmsSigma;const l={boxes:o,scores:i},h={maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:a},c=S.runKernel(nu,l,h);return{selectedIndices:c[0],selectedScores:c[1]}}const pw=N({nonMaxSuppressionWithScore_:hw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function fw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=d(t,"boxes","nonMaxSuppressionAsync"),i=d(e,"scores","nonMaxSuppressionAsync"),u=Gt(o,i,n,r,s,a);n=u.maxOutputSize,r=u.iouThreshold,s=u.scoreThreshold,a=u.softNmsSigma;const l=await Promise.all([o.data(),i.data()]),h=l[0],c=l[1],{selectedIndices:f,selectedScores:m}=np(h,c,n,r,s,a);return o!==t&&o.dispose(),i!==e&&i.dispose(),{selectedIndices:ke(f,"int32"),selectedScores:ke(m)}}const mw=fw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=d(t,"boxes","nonMaxSuppression"),i=d(e,"scores","nonMaxSuppression"),u=Gt(o,i,n,r,s,null),l=u.maxOutputSize,h=u.iouThreshold,c=u.scoreThreshold,f={boxes:o,scores:i},m={maxOutputSize:l,iouThreshold:h,scoreThreshold:c,padToMaxOutputSize:a},b=S.runKernel(tu,f,m);return{selectedIndices:b[0],validOutputs:b[1]}}const gw=N({nonMaxSuppressionPadded_:dw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function yw(t,e,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=d(t,"boxes","nonMaxSuppressionAsync"),i=d(e,"scores","nonMaxSuppressionAsync"),u=Gt(o,i,n,r,s,null),l=u.maxOutputSize,h=u.iouThreshold,c=u.scoreThreshold,[f,m]=await Promise.all([o.data(),i.data()]),{selectedIndices:b,validOutputs:T}=tp(f,m,l,h,c,a);return o!==t&&o.dispose(),i!==e&&i.dispose(),{selectedIndices:ke(b,"int32"),validOutputs:M(T,"int32")}}const bw=yw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ww(t,e,n=!1,r=!1){const s=d(t,"images","resizeBilinear");g(s.rank===3||s.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`),g(e.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${e}.`),g(r===!1||n===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let a=s,o=!1;s.rank===3&&(o=!0,a=I(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:r,size:e},l=S.runKernel(wu,i,u);return o?I(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Nw=N({resizeBilinear_:ww});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sw(t,e,n=!1,r=!1){const s=d(t,"images","resizeNearestNeighbor");g(s.rank===3||s.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`),g(e.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${e}.`),g(s.dtype==="float32"||s.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),g(r===!1||n===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let a=s,o=!1;s.rank===3&&(o=!0,a=I(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:r,size:e},l=S.runKernel(bu,i,u);return o?I(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Tw=N({resizeNearestNeighbor_:Sw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $w(t,e="binary",n=!1,r=.5){const s=d(t,"image","threshold"),a=.2989,o=.587,i=.114,u=s.shape[0]*s.shape[1];let l=F(ke([r]),255),h,c,f,m;if(g(s.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`),g(s.shape[2]===3||s.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`),g(s.dtype==="int32"||s.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`),g(e==="otsu"||e==="binary",()=>`Method must be binary or otsu, but was ${e}`),s.shape[2]===3){[h,c,f]=Mt(s,[1,1,1],-1);const w=F(h,a),$=F(c,o),O=F(f,i);m=L(L(w,$),O)}else m=t;if(e==="otsu"){const w=Is(J(ea(m),"int32"),De([]),256);l=Ew(w,u)}const b=n?ir(m,l):kn(m,l);return J(F(b,255),"int32")}function Ew(t,e){let n=ke([-1]),r=ke([0]),s=ke([0]),a,o,i,u,l,h;for(let c=0;c<t.size-1;c++){a=H(t,0,c+1),o=H(t,c+1),l=Z(X(a),e),h=Z(X(o),e);const f=X(F(a,Vt(0,a.size)));i=Z(f,X(a));const m=qt(o.shape,a.size),b=L(Vt(0,o.size),m),T=F(o,b);u=Z(X(T),X(o));const w=j(i,u),$=j(i,u),O=F(l,h);s=F(F(O,w),$);const v=kn(s,r);r=He(v,s,r),n=He(v,ke([c]),n)}return n}const kw=N({threshold_:$w});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vw(t,e,n="nearest",r="constant",s=0,a){const o=d(t,"image","transform","float32"),i=d(e,"transforms","transform","float32");g(o.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`),g(i.rank===2&&(i.shape[0]===o.shape[0]||i.shape[0]===1)&&i.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),g(a==null||a.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${a}.`);const u={image:o,transforms:i},l={interpolation:n,fillMode:r,fillValue:s,outputShape:a};return S.runKernel(tl,u,l)}const _w=N({transform_:vw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Iw(t,e,n){const r=d(t,"a","bandPart");g(r.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`);const s=r.shape,[a,o]=r.shape.slice(-2);let i,u;typeof e=="number"?(g(e%1===0,()=>`bandPart(): numLower must be an integer, got ${e}.`),g(e<=a,()=>`bandPart(): numLower (${e}) must not be greater than the number of rows (${a}).`),i=d(e<0?a:e,"numLower","bandPart")):(g(e.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),i=He(Yn(e,0),a,pn(e,a))),typeof n=="number"?(g(n%1===0,()=>`bandPart(): numUpper must be an integer, got ${n}.`),g(n<=o,()=>`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`),u=d(n<0?o:n,"numUpper","bandPart")):(g(n.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),u=He(Yn(n,0),o,pn(n,o)));const l=I(Vt(0,a,1,"int32"),[-1,1]),h=Vt(0,o,1,"int32"),c=j(l,h),f=cn(ir(c,i),Ps(c,Fe(u))),m=kt([a,o],r.dtype);return I(je(ct(I(r,[-1,a,o])).map(b=>He(f,b,m))),s)}const xw=N({bandPart_:Iw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Aw(t){let e;if(Array.isArray(t)){e=!1,g(t!=null&&t.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const s=t[0].shape[0];for(let a=1;a<t.length;++a)g(t[a].shape[0]===s,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${t[a].shape[0]} vs. ${s})`)}else e=!0,t=Mt(t,t.shape[0],0).map(s=>fr(s,[0]));g(t.length<=t[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${t.length}) exceeds number of dimensions (${t[0].shape[0]}).`);const n=[],r=t;for(let s=0;s<t.length;++s)n.push(S.tidy(()=>{let a=r[s];if(s>0)for(let o=0;o<s;++o){const i=F(X(F(n[o],a)),n[o]);a=j(a,i)}return Z(a,En(a,"euclidean"))}));return e?je(n,0):n}const Ow=N({gramSchmidt_:Aw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dw(t,e=!1){if(g(t.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${t.rank}`),t.rank===2)return Va(t,e);{const n=t.shape.slice(0,t.shape.length-2).reduce((u,l)=>u*l),r=ct(I(t,[n,t.shape[t.shape.length-2],t.shape[t.shape.length-1]]),0),s=[],a=[];r.forEach(u=>{const[l,h]=Va(u,e);s.push(l),a.push(h)});const o=I(je(s,0),t.shape),i=I(je(a,0),t.shape);return[o,i]}}function Va(t,e=!1){return S.tidy(()=>{g(t.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${t.shape.length}D Tensor.`);const n=t.shape[0],r=t.shape[1];let s=Fs(n),a=Ge(t);const o=Ct([[1]],[1,1]);let i=Ge(o);const u=n>=r?r:n;for(let l=0;l<u;++l){const h=a,c=i,f=s;[i,a,s]=S.tidy(()=>{const m=H(a,[l,l],[n-l,1]),b=En(m),T=H(a,[l,l],[1,1]),w=He(kn(T,0),Ct([[-1]]),Ct([[1]])),$=j(T,F(w,b)),O=Z(m,$);O.shape[0]===1?i=Ge(o):i=he([o,H(O,[1,0],[O.shape[0]-1,O.shape[1]])],0);const v=Fe(Z(q(w,$),b)),_=H(a,[l,0],[n-l,r]),x=F(v,i),D=mn(i);if(l===0)a=j(_,q(x,q(D,_)));else{const k=j(_,q(x,q(D,_)));a=he([H(a,[0,0],[l,r]),k],0)}const P=mn(x),C=H(s,[0,l],[n,s.shape[1]-l]);if(l===0)s=j(C,q(q(C,i),P));else{const k=j(C,q(q(C,i),P));s=he([H(s,[0,0],[n,l]),k],1)}return[i,a,s]}),de([h,c,f])}return!e&&n>r&&(s=H(s,[0,0],[n,r]),a=H(a,[0,0],[r,r])),[s,a]})}const Fw=N({qr_:Dw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var me;(function(t){t[t.NONE=0]="NONE",t[t.MEAN=1]="MEAN",t[t.SUM=2]="SUM",t[t.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(me||(me={}));function Cw(t,e,n=me.SUM_BY_NONZERO_WEIGHTS){const r=d(t,"losses","computeWeightedLoss");let s=null;e!=null&&(s=d(e,"weights","computeWeightedLoss"));const a=s==null?r:F(r,s);if(n===me.NONE)return a;if(n===me.SUM)return X(a);if(n===me.MEAN){if(s==null)return hn(a);{const o=r.size/s.size,i=Z(X(a),X(s));return o>1?Z(i,M(o)):i}}if(n===me.SUM_BY_NONZERO_WEIGHTS){if(s==null)return Z(X(a),M(r.size));{const o=F(s,tt(r.shape)),i=J(X(Us(o,M(0))),"float32");return Z(X(a),i)}}throw Error(`Unknown reduction: ${n}`)}const Ze=N({computeWeightedLoss_:Cw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rw(t,e,n,r=me.SUM_BY_NONZERO_WEIGHTS){const s=d(t,"labels","absoluteDifference"),a=d(e,"predictions","absoluteDifference");let o=null;n!=null&&(o=d(n,"weights","absoluteDifference")),ge(s.shape,a.shape,"Error in absoluteDifference: ");const i=Se(j(s,a));return Ze(i,o,r)}const Pw=N({absoluteDifference_:Rw});function Lw(t,e,n,r,s=me.SUM_BY_NONZERO_WEIGHTS){const a=d(t,"labels","cosineDistance"),o=d(e,"predictions","cosineDistance");let i=null;r!=null&&(i=d(r,"weights","cosineDistance")),ge(a.shape,o.shape,"Error in cosineDistance: ");const u=M(1),l=j(u,X(F(a,o),n,!0));return Ze(l,i,s)}const Bw=N({cosineDistance_:Lw});function zw(t,e,n,r=me.SUM_BY_NONZERO_WEIGHTS){let s=d(t,"labels","hingeLoss");const a=d(e,"predictions","hingeLoss");let o=null;n!=null&&(o=d(n,"weights","hingeLoss")),ge(s.shape,a.shape,"Error in hingeLoss: ");const i=M(1);s=j(F(M(2),s),i);const u=_n(j(i,F(s,a)));return Ze(u,o,r)}const Vw=N({hingeLoss_:zw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jw(t,e,n,r=1,s=me.SUM_BY_NONZERO_WEIGHTS){const a=d(t,"labels","huberLoss"),o=d(e,"predictions","huberLoss");let i=null;n!=null&&(i=d(n,"weights","huberLoss")),ge(a.shape,o.shape,"Error in huberLoss: ");const u=M(r),l=Se(j(o,a)),h=pn(l,u),c=j(l,h),f=L(F(M(.5),Ie(h)),F(u,c));return Ze(f,i,s)}const Mw=N({huberLoss_:jw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ww(t,e,n,r=1e-7,s=me.SUM_BY_NONZERO_WEIGHTS){const a=d(t,"labels","logLoss"),o=d(e,"predictions","logLoss");let i=null;n!=null&&(i=d(n,"weights","logLoss")),ge(a.shape,o.shape,"Error in logLoss: ");const u=M(1),l=M(r),h=Fe(F(a,zt(L(o,l)))),c=F(j(u,a),zt(L(j(u,o),l))),f=j(h,c);return Ze(f,i,s)}const qw=N({logLoss_:Ww});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uw(t,e,n,r=me.SUM_BY_NONZERO_WEIGHTS){const s=d(t,"labels","meanSquaredError"),a=d(e,"predictions","meanSquaredError");let o=null;n!=null&&(o=d(n,"weights","meanSquaredError")),ge(s.shape,a.shape,"Error in meanSquaredError: ");const i=na(s,a);return Ze(i,o,r)}const Gw=N({meanSquaredError_:Uw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hw(t,e){const n=d(t,"labels","sigmoidCrossEntropyWithLogits"),r=d(e,"logits","sigmoidCrossEntropyWithLogits");ge(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=_n(r),a=F(r,n),o=Bs(it(Fe(Se(r))));return L(j(s,a),o)}function Kw(t,e,n,r=0,s=me.SUM_BY_NONZERO_WEIGHTS){let a=d(t,"multiClassLabels","sigmoidCrossEntropy");const o=d(e,"logits","sigmoidCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","sigmoidCrossEntropy")),ge(a.shape,o.shape,"Error in sigmoidCrossEntropy: "),r>0){const l=M(r),h=M(1),c=M(.5);a=L(F(a,j(h,l)),F(c,l))}const u=Hw(a,o);return Ze(u,i,s)}const Xw=N({sigmoidCrossEntropy_:Kw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zw(t,e,n=-1){if(n===-1&&(n=e.rank-1),n!==e.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${e.rank} and dim was ${n}`);return Ve((s,a,o)=>{const u=Vs(a,[n],!0),l=j(J(a,"float32"),u);o([s,l]);const h=Fe(F(l,s));return{value:X(h,[n]),gradFunc:(m,b)=>{const[T,w]=b,$=$n(m.shape,[n]);return[F(I(m,$),j(J(T,"float32"),it(w))),F(I(m,$),j(it(w),J(T,"float32")))]}}})(t,e)}function Jw(t,e,n,r=0,s=me.SUM_BY_NONZERO_WEIGHTS){let a=d(t,"onehotLabels","softmaxCrossEntropy");const o=d(e,"logits","softmaxCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","softmaxCrossEntropy")),ge(a.shape,o.shape,"Error in softmaxCrossEntropy: "),r>0){const l=M(r),h=M(1),c=M(a.shape[1]);a=L(F(a,j(h,l)),Z(l,c))}const u=Zw(a,o);return Ze(u,i,s)}const Yw=N({softmaxCrossEntropy_:Jw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qw(t,e,n,r){const s=d(t,"indices","sparseFillEmptyRows","int32"),a=d(e,"values","sparseFillEmptyRows"),o=d(n,"denseShape","sparseFillEmptyRows","int32"),i=d(r,"defaultValue","sparseFillEmptyRows",a.dtype);if(s.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${s.shape}`);if(a.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${a.shape}`);if(o.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${o.shape}`);if(i.rank!==0)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const u={indices:s,values:a,denseShape:o,defaultValue:i},l=S.runKernel(Vu,u);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}const e1=N({sparseFillEmptyRows_:Qw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function t1(t,e,n){const r=d(t,"inputIndices","sparseReshape","int32"),s=d(e,"inputShape","sparseReshape","int32"),a=d(n,"newShape","sparseReshape","int32");if(r.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${r.shape}`);if(s.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(a.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${a.shape}`);const o={inputIndices:r,inputShape:s,newShape:a},i=S.runKernel(ju,o);return{outputIndices:i[0],outputShape:i[1]}}const n1=N({sparseReshape_:t1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r1(t,e,n){const r=d(t,"data","sparseSegmentMean"),s=d(e,"indices","sparseSegmentMean","int32"),a=d(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${s.shape}`);if(a.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return S.runKernel(Mu,o)}const s1=N({sparseSegmentMean_:r1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function a1(t,e,n){const r=d(t,"data","sparseSegmentSum"),s=d(e,"indices","sparseSegmentSum","int32"),a=d(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${s.shape}`);if(a.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return S.runKernel(Wu,o)}const o1=N({sparseSegmentSum_:a1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function i1(t,e,n,r,s,a,o,i){const u=d(t,"data","stringNGrams","string");if(u.dtype!=="string")throw new Error("Data must be of datatype string");if(u.shape.length!==1)throw new Error(`Data must be a vector, saw: ${u.shape}`);const l=d(e,"dataSplits","stringNGrams");if(l.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const h={separator:n,nGramWidths:r,leftPad:s,rightPad:a,padWidth:o,preserveShortSequences:i},c={data:u,dataSplits:l},f=S.runKernel(Ku,c,h);return{nGrams:f[0],nGramsSplits:f[1]}}const u1=N({stringNGrams_:i1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function l1(t,e,n=!0){const r=d(t,"input","stringSplit","string"),s=d(e,"delimiter","stringSplit","string");if(r.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(s.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const a={skipEmpty:n},o={input:r,delimiter:s},i=S.runKernel(Xu,o,a);return{indices:i[0],values:i[1],shape:i[2]}}const c1=N({stringSplit_:l1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function h1(t,e){const n=d(t,"input","stringToHashBucketFast","string"),r={numBuckets:e};if(e<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return S.runKernel(Zu,s,r)}const p1=N({stringToHashBucketFast_:h1});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f1(t,e,n,r=!0){const s=d(t,"input","staticRegexReplace","string"),a={pattern:e,rewrite:n,replaceGlobal:r};return S.runKernel(Gu,{x:s},a)}const m1=N({staticRegexReplace_:f1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rp={fft:hr,ifft:fn,rfft:pr,irfft:ta},sp={hammingWindow:V0,hannWindow:Yh,frame:Qh,stft:q0},ap={flipLeftRight:K0,grayscaleToRGB:Z0,resizeNearestNeighbor:Tw,resizeBilinear:Nw,rgbToGrayscale:Y0,rotateWithOffset:ew,cropAndResize:G0,nonMaxSuppression:nw,nonMaxSuppressionAsync:cw,nonMaxSuppressionWithScore:pw,nonMaxSuppressionWithScoreAsync:mw,nonMaxSuppressionPadded:gw,nonMaxSuppressionPaddedAsync:bw,threshold:kw,transform:_w},op={bandPart:xw,gramSchmidt:Ow,qr:Fw},ip={absoluteDifference:Pw,computeWeightedLoss:Ze,cosineDistance:Bw,hingeLoss:Vw,huberLoss:Mw,logLoss:qw,meanSquaredError:Gw,sigmoidCrossEntropy:Xw,softmaxCrossEntropy:Yw},up={sparseFillEmptyRows:e1,sparseReshape:n1,sparseSegmentMean:s1,sparseSegmentSum:o1},lp={stringNGrams:u1,stringSplit:c1,stringToHashBucketFast:p1,staticRegexReplace:m1};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const d1=new Map,Hr=new Map;class cp{getClassName(){return this.constructor.className}static fromConfig(e,n){return new e(n)}}class Ye{constructor(){this.classNameMap={}}static getMap(){return Ye.instance==null&&(Ye.instance=new Ye),Ye.instance}static register(e){Ye.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function hp(t,e,n){g(t.className!=null,()=>"Class being registered does not have the static className property defined."),g(typeof t.className=="string",()=>"className is required to be a string, but got type "+typeof t.className),g(t.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof e>"u"&&(e="Custom"),typeof n>"u"&&(n=t.className);const r=n,s=e+">"+r;return Ye.register(t),d1.set(s,t),Hr.set(t,s),t}function g1(t){return Hr.has(t)?Hr.get(t):t.className}const y1=Object.freeze(Object.defineProperty({__proto__:null,Serializable:cp,SerializationMap:Ye,getRegisteredName:g1,registerClass:hp},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ht extends cp{minimize(e,n=!1,r){const{value:s,grads:a}=this.computeGradients(e,r);if(r!=null){const o=r.map(i=>({name:i.name,tensor:a[i.name]}));this.applyGradients(o)}else this.applyGradients(a);return de(a),n?s:(s.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,n){return Lc(e,n)}dispose(){this.iterations_!=null&&de(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:M(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(ht,Symbol.hasInstance,{value:t=>t.minimize!=null&&t.computeGradients!=null&&t.applyGradients!=null});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class la extends ht{static get className(){return"Adadelta"}constructor(e,n,r=null){super(),this.learningRate=e,this.rho=n,this.epsilon=r,this.accumulatedGrads=[],this.accumulatedUpdates=[],r==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const a=S.registeredVariables[r],o=!1;this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accum_grad`,variable:U(()=>Te(a).variable(o))}),this.accumulatedUpdates[s]==null&&(this.accumulatedUpdates[s]={originalName:`${r}/accum_var`,variable:U(()=>Te(a).variable(o))});const i=Array.isArray(e)?e[s].tensor:e[r];if(i==null)return;const u=this.accumulatedGrads[s].variable,l=this.accumulatedUpdates[s].variable;U(()=>{const h=L(F(u,this.rho),F(Ie(i),1-this.rho)),c=F(Z(ze(L(l,this.epsilon)),ze(L(u,this.epsilon))),i),f=L(F(l,this.rho),F(Ie(c),1-this.rho));u.assign(h),l.assign(f);const m=L(F(c,-this.learningRate),a);a.assign(m)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(de(this.accumulatedGrads.map(e=>e.variable)),de(this.accumulatedUpdates.map(e=>e.variable)))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=e.length/2,r=!1;this.accumulatedGrads=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedUpdates=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.rho,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ca extends ht{static get className(){return"Adagrad"}constructor(e,n=.1){super(),this.learningRate=e,this.initialAccumulatorValue=n,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const a=S.registeredVariables[r];this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accumulator`,variable:U(()=>qt(a.shape,this.initialAccumulatorValue).variable(!1))});const o=Array.isArray(e)?e[s].tensor:e[r];if(o==null)return;const i=this.accumulatedGrads[s].variable;U(()=>{const u=L(i,Ie(o));i.assign(u);const l=L(F(Z(o,ze(L(u,S.backend.epsilon()))),-this.learningRate),a);a.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&de(this.accumulatedGrads.map(e=>e.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulatedGrads=e.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,n){return new e(n.learningRate,n.initialAccumulatorValue)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ha extends ht{static get className(){return"Adam"}constructor(e,n,r,s=null){super(),this.learningRate=e,this.beta1=n,this.beta2=r,this.epsilon=s,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],U(()=>{this.accBeta1=M(n).variable(),this.accBeta2=M(r).variable()}),s==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(r=>r.name):Object.keys(e);U(()=>{const r=j(1,this.accBeta1),s=j(1,this.accBeta2);n.forEach((a,o)=>{const i=S.registeredVariables[a],u=!1;this.accumulatedFirstMoment[o]==null&&(this.accumulatedFirstMoment[o]={originalName:`${a}/m`,variable:U(()=>Te(i).variable(u))}),this.accumulatedSecondMoment[o]==null&&(this.accumulatedSecondMoment[o]={originalName:`${a}/v`,variable:U(()=>Te(i).variable(u))});const l=Array.isArray(e)?e[o].tensor:e[a];if(l==null)return;const h=this.accumulatedFirstMoment[o].variable,c=this.accumulatedSecondMoment[o].variable,f=L(F(h,this.beta1),F(l,1-this.beta1)),m=L(F(c,this.beta2),F(Ie(l),1-this.beta2)),b=Z(f,r),T=Z(m,s);h.assign(f),c.assign(m);const w=L(F(Z(b,L(ze(T),this.epsilon)),-this.learningRate),i);i.assign(w)}),this.accBeta1.assign(F(this.accBeta1,this.beta1)),this.accBeta2.assign(F(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&de(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedSecondMoment!=null&&de(this.accumulatedSecondMoment.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e),U(()=>{this.accBeta1.assign(Bt(this.beta1,this.iterations_+1)),this.accBeta2.assign(Bt(this.beta2,this.iterations_+1))});const n=e.length/2,r=!1;this.accumulatedFirstMoment=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedSecondMoment=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class pa extends ht{static get className(){return"Adamax"}constructor(e,n,r,s=null,a=0){super(),this.learningRate=e,this.beta1=n,this.beta2=r,this.epsilon=s,this.decay=a,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],U(()=>{this.iteration=M(0).variable(),this.accBeta1=M(n).variable()}),s==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){const n=Array.isArray(e)?e.map(r=>r.name):Object.keys(e);U(()=>{const r=j(1,this.accBeta1),s=Z(-this.learningRate,L(F(this.iteration,this.decay),1));n.forEach((a,o)=>{const i=S.registeredVariables[a],u=!1;this.accumulatedFirstMoment[o]==null&&(this.accumulatedFirstMoment[o]={originalName:`${a}/m`,variable:Te(i).variable(u)}),this.accumulatedWeightedInfNorm[o]==null&&(this.accumulatedWeightedInfNorm[o]={originalName:`${a}/v`,variable:Te(i).variable(u)});const l=Array.isArray(e)?e[o].tensor:e[a];if(l==null)return;const h=this.accumulatedFirstMoment[o].variable,c=this.accumulatedWeightedInfNorm[o].variable,f=L(F(h,this.beta1),F(l,1-this.beta1)),m=F(c,this.beta2),b=Se(l),T=qs(m,b);h.assign(f),c.assign(T);const w=L(F(Z(s,r),Z(f,L(T,this.epsilon))),i);i.assign(w)}),this.iteration.assign(L(this.iteration,1)),this.accBeta1.assign(F(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&de(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedWeightedInfNorm!=null&&de(this.accumulatedWeightedInfNorm.map(e=>e.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Nr extends ht{static get className(){return"SGD"}constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const a=Array.isArray(e)?e[s].tensor:e[r];if(a==null)return;const o=S.registeredVariables[r];U(()=>{const i=L(F(this.c,a),o);o.assign(i)})}),this.incrementIterations()}setLearningRate(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=Oe(M(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(e=await this.extractIterations(e),e.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,n){return new e(n.learningRate)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class fa extends Nr{static get className(){return"Momentum"}constructor(e,n,r=!1){super(e),this.learningRate=e,this.momentum=n,this.useNesterov=r,this.accumulations=[],this.m=M(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const a=S.registeredVariables[r];this.accumulations[s]==null&&(this.accumulations[s]={originalName:`${r}/momentum`,variable:U(()=>Te(a).variable(!1))});const o=this.accumulations[s].variable,i=Array.isArray(e)?e[s].tensor:e[r];i!=null&&U(()=>{let u;const l=L(F(this.m,o),i);this.useNesterov?u=L(F(this.c,L(i,F(l,this.m))),a):u=L(F(this.c,l),a),o.assign(l),a.assign(u)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&de(this.accumulations.map(e=>e.variable))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=!1;this.accumulations=e.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,n){return new e(n.learningRate,n.momentum,n.useNesterov)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ma extends ht{static get className(){return"RMSProp"}constructor(e,n=.9,r=0,s=null,a=!1){if(super(),this.learningRate=e,this.decay=n,this.momentum=r,this.epsilon=s,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=a,s==null&&(this.epsilon=S.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map(r=>r.name):Object.keys(e)).forEach((r,s)=>{const a=S.registeredVariables[r],o=!1;this.accumulatedMeanSquares[s]==null&&(this.accumulatedMeanSquares[s]={originalName:`${r}/rms`,variable:U(()=>Te(a).variable(o))}),this.accumulatedMoments[s]==null&&(this.accumulatedMoments[s]={originalName:`${r}/momentum`,variable:U(()=>Te(a).variable(o))}),this.accumulatedMeanGrads[s]==null&&this.centered&&(this.accumulatedMeanGrads[s]={originalName:`${r}/mg`,variable:U(()=>Te(a).variable(o))});const i=Array.isArray(e)?e[s].tensor:e[r];if(i==null)return;const u=this.accumulatedMeanSquares[s].variable,l=this.accumulatedMoments[s].variable;U(()=>{const h=L(F(u,this.decay),F(Ie(i),1-this.decay));if(this.centered){const c=this.accumulatedMeanGrads[s].variable,f=L(F(c,this.decay),F(i,1-this.decay)),m=Z(F(i,this.learningRate),ze(j(h,L(Ie(f),this.epsilon)))),b=L(F(l,this.momentum),m);u.assign(h),c.assign(f),l.assign(b);const T=j(a,b);a.assign(T)}else{const c=L(F(u,this.decay),F(Ie(i),1-this.decay)),f=L(F(l,this.momentum),Z(F(i,this.learningRate),ze(L(c,this.epsilon))));u.assign(c),l.assign(f);const m=j(a,f);a.assign(m)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&de(this.accumulatedMeanSquares.map(e=>e.variable)),this.accumulatedMeanGrads!=null&&this.centered&&de(this.accumulatedMeanGrads.map(e=>e.variable)),this.accumulatedMoments!=null&&de(this.accumulatedMoments.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(e){e=await this.extractIterations(e);const n=this.centered?e.length/3:e.length/2,r=!1;this.accumulatedMeanSquares=e.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedMoments=e.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.centered&&(this.accumulatedMeanGrads=e.slice(n*2,n*3).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,n){return new e(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)}}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const b1=[la,ca,ha,pa,fa,ma,Nr];function w1(){for(const t of b1)hp(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const N1="model",S1=".json",T1=".weights.bin";function ja(t){return new Promise(e=>setTimeout(e)).then(t)}class vt{constructor(e){if(!B().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(vt.URL_SCHEME)&&(e=e.slice(vt.URL_SCHEME.length)),(e==null||e.length===0)&&(e=N1),this.modelJsonFileName=e+S1,this.weightDataFileName=e+T1}async save(e){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const n=Re.join(e.weightData),r=window.URL.createObjectURL(new Blob([n],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const s=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],a=Il(e,s),o=window.URL.createObjectURL(new Blob([JSON.stringify(a)],{type:"application/json"})),i=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(i.download=this.modelJsonFileName,i.href=o,await ja(()=>i.dispatchEvent(new MouseEvent("click"))),e.weightData!=null){const u=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;u.download=this.weightDataFileName,u.href=r,await ja(()=>u.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:wn(e)}}}}vt.URL_SCHEME="downloads://";class $1{constructor(e){if(e==null||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise((e,n)=>{const r=new FileReader;r.onload=s=>{const a=JSON.parse(s.target.result),o=a.modelTopology;if(o==null){n(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(a.weightsManifest==null){n(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){e({modelTopology:o});return}const u=Ts(a,l=>this.loadWeights(l));e(u)},r.onerror=s=>n(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),r.readAsText(this.jsonFile)})}loadWeights(e){const n=[],r=[];for(const o of e)n.push(...o.weights),r.push(...o.paths);const s=this.checkManifestAndWeightFiles(e),a=r.map(o=>this.loadWeightsFile(o,s[o]));return Promise.all(a).then(o=>[n,o])}loadWeightsFile(e,n){return new Promise((r,s)=>{const a=new FileReader;a.onload=o=>{const i=o.target.result;r(i)},a.onerror=o=>s(`Failed to weights data from file of path '${e}'.`),a.readAsArrayBuffer(n)})}checkManifestAndWeightFiles(e){const n=[],r=this.weightsFiles.map(a=>Aa(a.name)),s={};for(const a of e)a.paths.forEach(o=>{const i=Aa(o);if(n.indexOf(i)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${i}'`);if(n.push(i),r.indexOf(i)===-1)throw new Error(`Weight file with basename '${i}' is not provided.`);s[o]=this.weightsFiles[r.indexOf(i)]});if(n.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return s}}const E1=t=>B().getBool("IS_BROWSER")&&!Array.isArray(t)&&t.startsWith(vt.URL_SCHEME)?k1(t.slice(vt.URL_SCHEME.length)):null;Q.registerSaveRouter(E1);function k1(t="model"){return new vt(t)}function v1(t){return new $1(t)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ma(t,e,n,r){o(t),n=n??0,r=r??1,i(n,r);let s=0;const a=u=>(u.then(l=>{const h=n+ ++s/t.length*(r-n);return e(h),l}),u);function o(u){g(u!=null&&Array.isArray(u)&&u.length>0,()=>"promises must be a none empty array")}function i(u,l){g(u>=0&&u<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${u}`),g(l>=0&&l<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${l}`),g(l>=u,()=>`startFraction must be no more than endFraction, but got startFraction ${u} and endFraction ${l}`)}return Promise.all(t.map(a))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function pp(t,e){e==null&&(e={});const n=e.fetchFunc==null?B().platform.fetch:e.fetchFunc,r=t.map(c=>n(c,e.requestInit,{isBinary:!0})),i=(e.onProgress==null?await Promise.all(r):await Ma(r,e.onProgress,0,.5)).map(c=>c.arrayBuffer());return e.onProgress==null?await Promise.all(i):await Ma(i,e.onProgress,.5,1)}function _1(t,e){var n;const r=e.fetchFunc==null?B().platform.fetch:e.fetchFunc;let s=0,a;return(n=e.onProgress)===null||n===void 0||n.call(e,0),new ReadableStream({pull:async o=>{for(var i;s<t.length;){a||(a=(await r(t[s],e.requestInit,{isBinary:!0})).body.getReader());const{done:u,value:l}=await a.read();if(u){s++,a=void 0,(i=e.onProgress)===null||i===void 0||i.call(e,s/t.length);continue}o.enqueue(l);return}o.close()}})}async function I1(t,e="",n,r){return fp(o=>pp(o,{requestInit:r}))(t,e,n)}function fp(t){return async(e,n="",r)=>{const s=e.map(()=>!1),a={},o=r!=null?r.map(()=>!1):[],i=[];if(e.forEach((m,b)=>{let T=0;m.weights.forEach(w=>{const $="quantization"in w?w.quantization.dtype:w.dtype,O=St[$]*G(w.shape),v=()=>{s[b]=!0,a[b]==null&&(a[b]=[]),a[b].push({manifestEntry:w,groupOffset:T,sizeBytes:O})};r!=null?r.forEach((_,x)=>{_===w.name&&(v(),o[x]=!0)}):v(),i.push(w.name),T+=O})}),!o.every(m=>m)){const m=r.filter((b,T)=>!o[T]);throw new Error(`Could not find weights in manifest with names: ${m.join(", ")}. 
Manifest JSON has weights with names: ${i.join(", ")}.`)}const u=s.reduce((m,b,T)=>(b&&m.push(T),m),[]),l=[];u.forEach(m=>{e[m].paths.forEach(b=>{const T=n+(n.endsWith("/")?"":"/")+b;l.push(T)})});const h=await t(l),c={};let f=0;return u.forEach(m=>{const b=e[m].paths.length,T=new Re(h.slice(f,f+b));a[m].forEach($=>{const O=T.slice($.groupOffset,$.groupOffset+$.sizeBytes),v=kl(O,[$.manifestEntry]);for(const _ in v)c[_]=v[_]}),f+=b}),c}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const x1="application/octet-stream",A1="application/json";class da{constructor(e,n){if(this.DEFAULT_METHOD="POST",n==null&&(n={}),this.weightPathPrefix=n.weightPathPrefix,this.weightUrlConverter=n.weightUrlConverter,n.fetchFunc!=null?(g(typeof n.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=n.fetchFunc):this.fetch=B().platform.fetch,g(e!=null&&e.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(e)&&g(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,n.requestInit!=null&&n.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=n.requestInit||{},this.loadOptions=n}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const n=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);n.body=new FormData;const r=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],s=Il(e,r);if(n.body.append("model.json",new Blob([JSON.stringify(s)],{type:A1}),"model.json"),e.weightData!=null){const o=Re.join(e.weightData);n.body.append("model.weights.bin",new Blob([o],{type:x1}),"model.weights.bin")}const a=await this.fetch(this.path,n);if(a.ok)return{modelArtifactsInfo:wn(e),responses:[a]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${a.status}.`)}async loadModelJSON(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let n;try{n=await e.json()}catch{let o=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?o+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":o+=" Please make sure the server is serving valid JSON for this request.",new Error(o)}const r=n.modelTopology,s=n.weightsManifest;if(r==null&&s==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return n}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const e=await this.loadModelJSON();return Ts(e,n=>this.loadWeights(n))}async loadStream(){const e=await this.loadModelJSON(),n=await this.getWeightUrls(e.weightsManifest),r=Xn(e.weightsManifest),s=()=>_1(n,this.loadOptions);return Object.assign(Object.assign({},e),{weightSpecs:r,getWeightStream:s})}async getWeightUrls(e){const n=Array.isArray(this.path)?this.path[1]:this.path,[r,s]=O1(n),a=this.weightPathPrefix||r,o=[],i=[];for(const u of e)for(const l of u.paths)this.weightUrlConverter!=null?i.push(this.weightUrlConverter(l)):o.push(a+l+s);return this.weightUrlConverter&&o.push(...await Promise.all(i)),o}async loadWeights(e){const n=await this.getWeightUrls(e),r=Xn(e),s=await pp(n,this.loadOptions);return[r,s]}}da.URL_SCHEME_REGEX=/^https?:\/\//;function O1(t){const e=t.lastIndexOf("/"),n=t.lastIndexOf("?"),r=t.substring(0,e),s=n>e?t.substring(n):"";return[r+"/",s]}function Kr(t){return t.match(da.URL_SCHEME_REGEX)!=null}const mp=(t,e)=>{if(typeof fetch>"u"&&(e==null||e.fetchFunc==null))return null;{let n=!0;if(Array.isArray(t)?n=t.every(r=>Kr(r)):n=Kr(t),n)return ga(t,e)}return null};Q.registerSaveRouter(mp);Q.registerLoadRouter(mp);function ga(t,e){return new da(t,e)}function D1(t,e){return ga(t,e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class _r{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}}class dp{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}}class F1{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=n=>Promise.resolve(e.save(n)))}}function C1(t,e,n,r){const s=arguments;return new F1(er(...s))}function er(t,e,n,r){return arguments.length===1?t.modelTopology!=null||t.weightSpecs!=null?new _r(t):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new _r({modelTopology:t})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new _r({modelTopology:t,weightSpecs:e,weightData:n,trainingConfig:r}))}function R1(t){return new dp(t)}function P1(t){return new dp(t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ya=Object.freeze(Object.defineProperty({__proto__:null,CompositeArrayBuffer:Re,browserFiles:v1,browserHTTPRequest:D1,concatenateArrayBuffers:xm,copyModel:Jm,decodeWeights:kl,decodeWeightsStream:_l,encodeWeights:$m,fromMemory:C1,fromMemorySync:er,getLoadHandlers:Lm,getModelArtifactsForJSON:Ts,getModelArtifactsForJSONSync:Ss,getModelArtifactsInfoForJSON:wn,getSaveHandlers:Pm,getWeightSpecs:Xn,http:ga,isHTTPScheme:Kr,listModels:Xm,loadWeights:I1,moveModel:Ym,registerLoadRouter:Rm,registerSaveRouter:Cm,removeModel:Zm,weightsLoaderFactory:fp,withSaveHandler:R1,withSaveHandlerSync:P1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function L1(t,e,n){const r=d(t,"labels","confusionMatrix"),s=d(e,"predictions","confusionMatrix");g(n==null||n>0&&Number.isInteger(n),()=>`If provided, numClasses must be a positive integer, but got ${n}`),g(r.rank===1,()=>`Expected the rank of labels to be 1, but got ${r.rank}`),g(s.rank===1,()=>`Expected the rank of predictions to be 1, but got ${s.rank}`),g(r.shape[0]===s.shape[0],()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`),g(n>0&&Number.isInteger(n),()=>`numClasses is required to be a positive integer, but got ${n}`);const a=Qn(J(r,"int32"),n),o=Qn(J(s,"int32"),n),i=mn(a),u=q(i,o);return J(u,"int32")}const B1=N({confusionMatrix_:L1});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const z1=Object.freeze(Object.defineProperty({__proto__:null,confusionMatrix:B1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let pt,Wa=!1;function gp(t,e=3){if(e>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(t==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,a=!1,o=!1,i=!1;if(t.data instanceof Uint8Array)n=!0;else if(typeof ImageData<"u"&&t instanceof ImageData)r=!0;else if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)s=!0;else if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement)a=!0;else if(t.getContext!=null)o=!0;else if(typeof ImageBitmap<"u"&&t instanceof ImageBitmap)i=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${t.constructor.name}`);if(nn(Ar,S.backendName)!=null){const b={pixels:t},T={numChannels:e};return S.runKernel(Ar,b,T)}const[l,h]=s?[t.videoWidth,t.videoHeight]:[t.width,t.height];let c;if(o)c=t.getContext("2d").getImageData(0,0,l,h).data;else if(r||n)c=t.data;else if(a||s||i){if(pt==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")pt=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else pt=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});pt.canvas.width=l,pt.canvas.height=h,pt.drawImage(t,0,0,l,h),c=pt.getImageData(0,0,l,h).data}let f;if(e===4)f=new Int32Array(c);else{const b=l*h;f=new Int32Array(b*e);for(let T=0;T<b;T++)for(let w=0;w<e;++w)f[T*e+w]=c[T*4+w]}return sa(f,[h,l,e],"int32")}function V1(t){return t!=null&&t.data instanceof Uint8Array}function j1(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function M1(t){return t!=null&&t.width!==0&&t.height!==0}function W1(t){return j1()&&!(t instanceof ImageBitmap)&&M1(t)&&!V1(t)}async function q1(t,e=3){let n=null;if(B().getBool("WRAP_TO_IMAGEBITMAP")&&W1(t)){let r;try{r=await createImageBitmap(t,{premultiplyAlpha:"none"})}catch{r=null}r!=null&&r.width===t.width&&r.height===t.height?n=r:n=t}else n=t;return gp(n,e)}function yp(t){if(t.rank!==2&&t.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${t.rank}.`);const e=t.rank===2?1:t.shape[2];if(e>4||e===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${e}`);if(t.dtype!=="float32"&&t.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${t.dtype}. Please use float32 or int32 tensors.`)}function U1(t){const e=(t==null?void 0:t.alpha)||1;if(e>1||e<0)throw new Error(`Alpha value ${e} is suppoed to be in range [0 - 1].`)}async function G1(t,e){let n=d(t,"img","toPixels");if(!(t instanceof ne)){const l=n;n=J(l,"int32"),l.dispose()}yp(n);const[r,s]=n.shape.slice(0,2),a=n.rank===2?1:n.shape[2],o=await n.data(),i=n.dtype==="float32"?255:1,u=new Uint8ClampedArray(s*r*4);for(let l=0;l<r*s;++l){const h=[0,0,0,255];for(let f=0;f<a;f++){const m=o[l*a+f];if(n.dtype==="float32"){if(m<0||m>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${m}.`)}else if(n.dtype==="int32"&&(m<0||m>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${m}.`);a===1?(h[0]=m*i,h[1]=m*i,h[2]=m*i):h[f]=m*i}const c=l*4;u[c+0]=Math.round(h[0]),u[c+1]=Math.round(h[1]),u[c+2]=Math.round(h[2]),u[c+3]=Math.round(h[3])}if(e!=null){Wa||nn(ms,S.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),Wa=!0),e.width=s,e.height=r;const l=e.getContext("2d"),h=new ImageData(u,s,r);l.putImageData(h,0,0)}return n!==t&&n.dispose(),u}function H1(t,e,n){let r=d(t,"img","draw");if(!(t instanceof ne)){const o=r;r=J(o,"int32"),o.dispose()}yp(r),U1(n==null?void 0:n.imageOptions);const s={image:r},a={canvas:e,options:n};S.runKernel(ms,s,a)}const K1=N({fromPixels_:gp}),X1=Object.freeze(Object.defineProperty({__proto__:null,draw:H1,fromPixels:K1,fromPixelsAsync:q1,toPixels:G1},Symbol.toStringTag,{value:"Module"}));function bp(t,e){const n=t.shape.length,r=e.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[r-1]} vs. ${n}`);if(G(t.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${t.shape}.`);const s=e.shape,a=s[s.length-1];let o=1;for(let c=0;c<s.length-1;++c)o*=s[c];const i=t.shape,u=s.slice();u.pop();let l=1;for(let c=a;c<n;++c)l*=i[c],u.push(i[c]);const h=[...Wt(t.shape).map(c=>c/l),1].slice(0,a);return[u,o,l,h]}const Z1=Object.freeze(Object.defineProperty({__proto__:null,prepareAndValidate:bp},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xr=-2,J1=-1;function Y1(t,e,n){const r=t.shape.length;g(r===e.length,()=>`Error in slice${r}D: Length of begin ${e} must match the rank of the array (${r}).`),g(r===n.length,()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`);for(let s=0;s<r;++s)g(e[s]+n[s]<=t.shape[s],()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${e[s]+n[s]}) would overflow input.shape[${s}] (${t.shape[s]})`)}function Q1(t){const e=[];let n=0;for(;t>0;)t&1&&e.push(n),t/=2,n++;return e}function eN(t,e,n){const r=[];for(let s=0;s<t.length;s++)r[s]=Math.ceil((e[s]-t[s])/n[s]);return r}function wp(t,e,n,r){const s=[...t];for(let a=s.length;a<r.length;a++)s.push(1);for(let a=0;a<n;a++)a===0?s[e]=1:(s.splice(e,0,1),s.pop());return s}function Np(t,e,n){return n<=t?n:n-(e-1)}function Sp(t,e){const n=[];for(let r=0;r<t;r++)n.push(e+r);return n}function tN(t,e,n,r,s,a,o,i,u){const l=t.length;let h=new Array(l),c=new Array(l),f=new Array(l);if(e.length&&n>0){const m=e[0],b=n+1;h=Tp(o,m,b,r,t),c=$p(i,m,b,s,t),f=wp(a,m,b,t)}else for(let m=0;m<l;m++)h[m]=kp(o,r,a,t,m,u),c[m]=vp(i,s,a,t,m,u),f[m]=Ep(a,m,u);return{begin:h,end:c,strides:f}}function Tp(t,e,n,r,s){const a=[...s],o=Sp(n,e);for(let i=0;i<a.length;i++)if(o.indexOf(i)>-1)a[i]=0;else{const u=Np(e,n,i);let l=r[u];t&1<<u&&(l=0),a[i]=l}return a}function $p(t,e,n,r,s){const a=[...s],o=Sp(n,e);for(let i=0;i<a.length;i++)if(o.indexOf(i)>-1)a[i]=Number.MAX_SAFE_INTEGER;else{const u=Np(e,n,i);let l=r[u];t&1<<u&&(l=Number.MAX_SAFE_INTEGER),a[i]=l}for(let i=0;i<a.length;i++){const u=s[i];a[i]<0&&(a[i]+=u),a[i]=en(0,a[i],s[i])}return a}function Ep(t,e,n){let r=t[e];return(n&1<<e||r==null)&&(r=1),r}function kp(t,e,n,r,s,a){let o=e[s];const i=n[s]||1;(t&1<<s||a&1<<s||o==null)&&(i>0?o=Number.MIN_SAFE_INTEGER:o=Number.MAX_SAFE_INTEGER);const u=r[s];return o<0&&(o+=u),o=en(0,o,u-1),o}function vp(t,e,n,r,s,a){let o=e[s];const i=n[s]||1;(t&1<<s||a&1<<s||o==null)&&(i>0?o=Number.MAX_SAFE_INTEGER:o=Number.MIN_SAFE_INTEGER);const u=r[s];return o<0&&(o+=u),i>0?o=en(0,o,u):o=en(-1,o,u-1),o}function nN(t,e,n){let r=n.length;for(let s=0;s<n.length;s++)if(n[s]>1){r=s;break}for(let s=r+1;s<n.length;s++)if(e[s]>0||n[s]!==t[s])return!1;return!0}function rN(t,e){let n=t.length>0?t[t.length-1]:1;for(let r=0;r<t.length-1;r++)n+=t[r]*e[r];return n}function sN(t,e,n){let r;const s=t.shape.length;typeof e=="number"?r=[e,...new Array(s-1).fill(0)]:e.length<s?r=e.concat(new Array(s-e.length).fill(0)):r=e.slice(),r.forEach(o=>{g(o!==-1,()=>"slice() does not support negative begin indexing.")});let a;return n==null?a=new Array(s).fill(-1):typeof n=="number"?a=[n,...new Array(s-1).fill(-1)]:n.length<s?a=n.concat(new Array(s-n.length).fill(-1)):a=n,a=a.map((o,i)=>o>=0?o:(g(o===-1,()=>`Negative size values should be exactly -1 but got ${o} for the slice() size at index ${i}.`),t.shape[i]-r[i])),[r,a]}function aN(t,e,n,r,s,a,o,i,u){let l;if(r==null?(l=new Array(e.length),l.fill(1)):l=r,o!=null&&(o&o-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const c={dims:l.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:n.slice(),strides:l.slice(),beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};for(let v=0;v<c.dims;v++)h&&(1<<v&i)!==0&&c.numAddAxisAfterEllipsis++,1<<v&o&&(h=!0);h||(c.ellipsisMask|=1<<c.dims,c.dims++);const f={dims:t.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};oN(c,f);let m=!0,b=!0,T=!0;const w=[],$=[];for(let v=0;v<t.length;++v){if(f.strides[v]===0)throw Error(`strides[${v}] must be non-zero`);const _=!!(f.shrinkAxisMask&1<<v),x=t[v];if(x===-1){w.push(_?1:-1);continue}const D=[f.beginMask&1<<v,f.endMask&1<<v],P=[f.strides[v]>0?0:-1,f.strides[v]>0?x:x-1];if(_&&f.strides[v]<=0)throw Error("only stride 1 allowed on non-range indexing.");T=T&&f.strides[v]===1;const C=!!(f.beginMask&1<<v&&f.endMask&1<<v);if(f.beginValid&&f.endValid){if(_){const A=f.begin[v]<0?x+f.begin[v]:f.begin[v];if(f.begin[v]=A,f.end[v]=f.begin[v]+1,A<0||A>=x)throw Error(`slice index ${f.begin[v]} of dimension ${v} out of bounds.`)}else f.begin[v]=qa(f.begin[v],0,f.strides[v],x,D,P),f.end[v]=qa(f.end[v],1,f.strides[v],x,D,P);const y=f.strides[v]===1&&f.begin[v]===0&&f.end[v]===x;m=m&&y,b=b&&(v===0&&f.strides[v]===1||y)}else m=m&&f.strides[v]===1&&C,b=b&&(v===0&&f.strides[v]===1||C);let k,E=!1;if(f.beginValid&&f.endValid?(k=f.end[v]-f.begin[v],E=!0):_?(k=1,E=!0):C&&x>=0&&(f.strides[v]<0?k=-x:k=x,E=!0),E){let y;k===0||k<0!=f.strides[v]<0?y=0:y=Math.trunc(k/f.strides[v])+(k%f.strides[v]!==0?1:0),w.push(y)}else w.push(-1)}for(let v=0;v<f.finalShapeGatherIndices.length;++v){const _=f.finalShapeGatherIndices[v];_>=0?$.push(w[_]):_===Xr&&$.push(1)}return{finalShapeSparse:$.filter((v,_)=>f.finalShapeGatherIndices[_]!==Xr),finalShape:$,isIdentity:m,sliceDim0:b,isSimpleSlice:T,begin:f.begin,end:f.end,strides:f.strides}}function oN(t,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let n=0;e.beginValid=t.begin!=null,e.endValid=t.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let r=0;r<t.dims;r++)if(1<<r&t.ellipsisMask){const s=Math.min(e.dims-(t.dims-r)+1+t.numAddAxisAfterEllipsis,e.dims);for(;n<s;n++)e.begin[n]=0,e.end[n]=0,e.strides[n]=1,e.beginMask|=1<<n,e.endMask|=1<<n,e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&t.newAxisMask)e.finalShapeGatherIndices.push(Xr),e.finalShapeGatherIndicesSparse.push(-1);else{if(n===e.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${e.dims} dims, ${e.begin.length}.`);t.begin!=null&&(e.begin[n]=t.begin[r]),t.end!=null&&(e.end[n]=t.end[r]),e.strides[n]=t.strides[r],t.beginMask&1<<r&&(e.beginMask|=1<<n),t.endMask&1<<r&&(e.endMask|=1<<n),t.shrinkAxisMask&1<<r?(e.finalShapeGatherIndices.push(J1),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<n):(e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(r)),e.inputShapeGatherIndicesSparse[n]=r,n++}}function qa(t,e,n,r,s,a){if(s[e])return n>0?a[e]:a[e+1&1];{const o=t<0?r+t:t;return o<a[0]?a[0]:o>a[1]?a[1]:o}}const _p=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:Y1,computeFlatOffset:rN,computeOutShape:eN,getNormalizedAxes:tN,isSliceContinous:nN,maskToAxes:Q1,parseSliceParams:sN,sliceInfo:aN,startForAxis:kp,startIndicesWithElidedDims:Tp,stopForAxis:vp,stopIndicesWithElidedDims:$p,stridesForAxis:Ep,stridesWithElidedDims:wp},Symbol.toStringTag,{value:"Module"}));/** @license See the LICENSE file. */const iN="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Ip{static sgd(e){return new Nr(e)}static momentum(e,n,r=!1){return new fa(e,n,r)}static rmsprop(e,n=.9,r=0,s=null,a=!1){return new ma(e,n,r,s,a)}static adam(e=.001,n=.9,r=.999,s=null){return new ha(e,n,r,s)}static adadelta(e=.001,n=.95,r=null){return new la(e,n,r)}static adamax(e=.002,n=.9,r=.999,s=null,a=0){return new pa(e,n,r,s,a)}static adagrad(e,n=.1){return new ca(e,n)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uN=Ip;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lN=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:t=>t();function cN(){return new Promise(t=>lN(()=>t()))}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hN(t,e){const n=t[0].length;t.forEach((s,a)=>{g(s.length===n,()=>`Error in concat${n}D: rank of tensors[${a}] must be the same as the rank of the rest (${n})`)}),g(e>=0&&e<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const r=t[0];t.forEach((s,a)=>{for(let o=0;o<n;o++)g(o===e||s[o]===r[o],()=>`Error in concat${n}D: Shape of tensors[${a}] (${s}) does not match the shape of the rest (${r}) along the non-concatenated axis ${a}.`)})}function pN(t,e){const n=t[0].slice();for(let r=1;r<t.length;r++)n[e]+=t[r][e];return n}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Pe;(function(t){t[t.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",t[t.VALUE_ROWIDS=1]="VALUE_ROWIDS",t[t.ROW_LENGTHS=2]="ROW_LENGTHS",t[t.ROW_SPLITS=3]="ROW_SPLITS",t[t.ROW_LIMITS=4]="ROW_LIMITS",t[t.ROW_STARTS=5]="ROW_STARTS"})(Pe||(Pe={}));function fN(t,e,n){let r=new Array;if(n==null&&e==null)return r;if(e==null)for(;r.length<t+n.length;)r.push(-1);else r=e.slice();if(n==null)return r;if(t+n.length!==r.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${t+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const a=n[s],o=r[r.length-n.length+s],i=r[o];if(a>=0)if(i>=0){if(i!==a)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${s+t}] = ${a} but shape[${s+t}] = ${i}`)}else r[o]=a}return r}function mN(t){const e={FIRST_DIM_SIZE:Pe.FIRST_DIM_SIZE,VALUE_ROWIDS:Pe.VALUE_ROWIDS,ROW_LENGTHS:Pe.ROW_LENGTHS,ROW_SPLITS:Pe.ROW_SPLITS,ROW_LIMITS:Pe.ROW_LIMITS,ROW_STARTS:Pe.ROW_STARTS},n=[];for(const r of t)if(r in e)n.push(e[r]);else break;return n}function dN(t){return t.length===0?0:t[0]===Pe.FIRST_DIM_SIZE?t.length-1:t.length}function gN(t,e){if(t==null||e==null)return;const n=t.length,r=e.length;if(n>=r)throw new Error(`defaultValue.shape=${t} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const a=t[s],o=e[s+1];if(a>=0&&o>=0&&a!==1&&a!==o)throw new Error(`defaultValue.shape=${t}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${s-t.length}] = ${a} but ragged tensor input.flatValues.shape[${s-t.length}] = ${o}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ba=30;function yN(t){return t<=ba?t:Un(t,Math.floor(Math.sqrt(t)))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bN(t,e,n){const r=n*(typeof t=="number"?t:t[0]),s=e*(typeof t=="number"?t:t[1]);return[r,s]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wN(t,e,n,r=!0){let s=[];if(r)s=s.concat(e.slice(0)),s.push(t[0]/n),s=s.concat(t.slice(1));else{s=s.concat(t[0]);const a=e.length;for(let o=0;o<a;++o)s=s.concat([t[o+1]/e[o],e[o]]);s=s.concat(t.slice(a+1))}return s}function NN(t,e,n=!0){const r=[];if(n){r.push(e);for(let s=e+1;s<t;++s)s<=2*e?(r.push(s),r.push(s-(e+1))):r.push(s)}else{const s=[],a=[];for(let o=1;o<t;++o)o>=e*2+1||o%2===1?a.push(o):s.push(o);r.push(...s),r.push(0),r.push(...a)}return r}function SN(t,e,n,r=!0){const s=[];r?s.push(t[0]/n):s.push(t[0]*n);for(let a=1;a<t.length;++a)a<=e.length?r?s.push(e[a-1]*t[a]):s.push(t[a]/e[a-1]):s.push(t[a]);return s}function TN(t,e){const n=[0];for(let r=0;r<e;++r)n.push(t[r][0]);return n}function $N(t,e,n){const r=t.slice(0,1);for(let s=0;s<n;++s)r.push(t[s+1]-e[s][0]-e[s][1]);return r}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const EN=1.7580993408473768,kN=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vN=.3275911,_N=.254829592,IN=-.284496736,xN=1.421413741,AN=-1.453152027,ON=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function DN(t,e){if(t.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${t.length}, imag: ${e.length}.`);const n=new Float32Array(t.length*2);for(let r=0;r<n.length;r+=2)n[r]=t[r/2],n[r+1]=e[r/2];return n}function FN(t){const e=new Float32Array(t.length/2),n=new Float32Array(t.length/2);for(let r=0;r<t.length;r+=2)e[r/2]=t[r],n[r/2]=t[r+1];return{real:e,imag:n}}function CN(t){const e=Math.ceil(t.length/4),n=new Float32Array(e),r=new Float32Array(e);for(let s=0;s<t.length;s+=4)n[Math.floor(s/4)]=t[s],r[Math.floor(s/4)]=t[s+1];return{real:n,imag:r}}function RN(t){const e=Math.floor(t.length/4),n=new Float32Array(e),r=new Float32Array(e);for(let s=2;s<t.length;s+=4)n[Math.floor(s/4)]=t[s],r[Math.floor(s/4)]=t[s+1];return{real:n,imag:r}}function PN(t,e){const n=t[e*2],r=t[e*2+1];return{real:n,imag:r}}function LN(t,e,n,r){t[r*2]=e,t[r*2+1]=n}function BN(t,e){const n=new Float32Array(t/2),r=new Float32Array(t/2);for(let s=0;s<Math.ceil(t/2);s++){const a=(e?2:-2)*Math.PI*(s/t);n[s]=Math.cos(a),r[s]=Math.sin(a)}return{real:n,imag:r}}function zN(t,e,n){const r=(n?2:-2)*Math.PI*(t/e),s=Math.cos(r),a=Math.sin(r);return{real:s,imag:a}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ir="->",VN=/->/g,Ua=",",Ga="...";function jN(t,e){t=t.replace(/\s/g,"");const n=(t.length-t.replace(VN,"").length)/Ir.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${Ir}").`);const[r,s]=t.split(Ir);g(r.indexOf(Ga)===-1,()=>`The ellipsis notation ("${Ga}") is not supported yet.`);const a=r.split(Ua),o=a.length;if(e!==o)throw new Error(`Expected ${o} input tensors, received ${e}`);if(o>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let f=0;f<s.length;++f){const m=s[f];if(!a.some(b=>b.indexOf(m)!==-1))throw new Error(`Output subscripts contain the label ${m} not present in the input subscripts.`);i.indexOf(m)===-1&&i.push(m)}for(let f=0;f<r.length;++f){const m=r[f];i.indexOf(m)===-1&&m!==Ua&&i.push(m)}const u=new Array(a.length);for(let f=0;f<o;++f){if(new Set(a[f].split("")).size!==a[f].length)throw new Error(`Found duplicate axes in input component ${a[f]}. Support for duplicate axes in input is not implemented yet.`);u[f]=[];for(let m=0;m<a[f].length;++m)u[f].push(i.indexOf(a[f][m]))}const l=i.length,h=s.length,c=[];for(let f=h;f<l;++f)c.push(f);return{allDims:i,summedDims:c,idDims:u}}function MN(t,e){let n=new Array(t);n.fill(-1);for(let s=0;s<e.length;++s)n[e[s]]=s;const r=[];for(let s=0;s<t;++s)n[s]===-1&&r.push(s);return n=n.filter(s=>s!==-1),{permutationIndices:n,expandDims:r}}function WN(t,e,n){const r=new Array(t);for(let s=0;s<n.length;++s){const a=n[s].shape;for(let o=0;o<e[s].length;++o)r[e[s][o]]===void 0?r[e[s][o]]=a[o]:g(r[e[s][o]]===a[o],()=>`Expected dimension ${r[e[s][o]]} at axis ${o} of input shaped ${JSON.stringify(a)}, but got dimension ${a[o]}`)}}function qN(t,e){const n=t,r=[];let s=0;t.length===0&&n.push(-1),s=t.length+1;for(let o=0;o<s;++o)r.push([]);const a=[];for(let o=0;o<n.length;++o){const i=n[o],u=GN(e,i);for(const l of u)a.indexOf(l)===-1&&(r[o].push(l),a.push(l))}return{path:n,steps:r}}function UN(t){return t.every((e,n)=>e===n)}function GN(t,e){const n=[];for(let r=0;r<t.length;++r)(t[r].length===0||t[r].indexOf(e)!==-1||e===-1)&&n.push(r);return n}function HN(t,e,n=0){let r=[];if(typeof e=="number")g(t.shape[n]%e===0,()=>"Number of splits must evenly divide the axis."),r=new Array(e).fill(t.shape[n]/e);else{const s=e.reduce((o,i)=>(i===-1&&(o+=1),o),0);g(s<=1,()=>"There should be only one negative value in split array.");const a=e.indexOf(-1);if(a!==-1){const o=e.reduce((i,u)=>u>0?i+u:i);e[a]=t.shape[n]-o}g(t.shape[n]===e.reduce((o,i)=>o+i),()=>"The sum of sizes must match the size of the axis dimension."),r=e}return r}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function KN(t){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${t}`}function XN(t,e){return`indices(${t}, 0) is invalid: ${e} < 0`}function ZN(t,e,n){return`indices(${t}, 0) is invalid: ${e} >= ${n}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function JN(t,e){return`only one output dimension may be -1, not both ${t} and ${e}`}function YN(t,e){return`size ${t} must be non-negative, not ${e}`}function QN(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function eS(t,e){const n=G(t),r=G(e);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${r}. inputShape=${t} outputShape= ${e}`}function tS(t,e){const n=G(t),r=G(e);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${r}. inputShape=${t} outputShape=${e}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nS(){return"segment ids must be >= 0"}function rS(){return"segment ids are not increasing"}function sS(t,e){return`Segment id ${t} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function aS(t,e,n){return`Bad: indices[${t}] == ${e} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function oS(t,e){let n=!1,r;for(t<=ba?(r=t,n=!0):r=Un(t,Math.floor(Math.sqrt(t)));!n;)r>e||r===t?n=!0:r=Un(t,r+1);return r}function iS(t,e,n){const r=[],s=t.length;for(let a=0;a<s;a++)a!==e?r.push(t[a]):r.push(n);return r}function uS(t,e,n,r){const s=e.shape.length,a=t.shape.length;if(r!==0&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>a)throw new Error(`batchDims (${r}) must be less than rank(x) (
    ${a}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let c=0;c<r;++c)if(t.shape[c]!==e.shape[c])throw new Error(`x.shape[${c}]: ${t.shape[c]} should be equal to indices.shape[${c}]: ${e.shape[c]}.`);const o=t.shape[n],i=[];let u=1,l=1,h=1;for(let c=0;c<r;++c)i.push(t.shape[c]),u*=t.shape[c];for(let c=r;c<n;c++)i.push(t.shape[c]),l*=t.shape[c];for(let c=r;c<s;c++)i.push(e.shape[c]);for(let c=n+1;c<a;c++)i.push(t.shape[c]),h*=t.shape[c];return{batchSize:u,sliceSize:h,outerSize:l,dimSize:o,outputShape:i}}const lS=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:uS,computeOutShape:iS,segOpComputeOptimalWindowSize:oS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cS(t){try{return t.map(e=>Hn(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function hS(t){return t.map(e=>bn(e))}const pS=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:_N,ERF_A2:IN,ERF_A3:xN,ERF_A4:AN,ERF_A5:ON,ERF_P:vN,PARALLELIZE_THRESHOLD:ba,get RowPartitionType(){return Pe},SELU_SCALE:kN,SELU_SCALEALPHA:EN,applyActivation:br,assertAndGetBroadcastShape:se,assertAxesAreInnerMostDims:_g,assertParamsConsistent:hN,assignToTypedArray:LN,axesAreInnerMostDims:Ds,calculateShapes:Rh,checkEinsumDimSizes:WN,checkPadOnDimRoundingMode:xe,combineLocations:Ic,combineRaggedTensorToTensorShapes:fN,complexWithEvenIndex:CN,complexWithOddIndex:RN,computeConv2DInfo:Nn,computeConv3DInfo:Xl,computeDefaultPad:ks,computeDilation2DInfo:Td,computeOptimalWindowSize:yN,computeOutAndReduceShapes:vg,computeOutShape:pN,computePool2DInfo:Kl,computePool3DInfo:$d,convertConv2DDataFormat:Zl,decodeEinsumEquation:jN,eitherStridesOrDilationsAreOne:Xe,expandShapeToKeepDim:$n,exponent:zN,exponents:BN,fromStringArrayToUint8:hS,fromUint8ToStringArray:cS,getAxesPermutation:Ig,getBroadcastDims:$c,getComplexWithIndex:PN,getEinsumComputePath:qN,getEinsumPermutation:MN,getFusedBiasGradient:yr,getFusedDyActivation:gr,getImageCenter:bN,getInnerMostAxes:Ag,getPermuted:NN,getRaggedRank:dN,getReductionAxes:xs,getReshaped:wN,getReshapedPermuted:SN,getRowPartitionTypesHelper:mN,getSliceBeginCoords:TN,getSliceSize:$N,getSparseFillEmptyRowsIndicesDenseShapeMismatch:KN,getSparseFillEmptyRowsNegativeIndexErrorMessage:XN,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:ZN,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:QN,getSparseReshapeInputOutputMismatchErrorMessage:tS,getSparseReshapeInputOutputMultipleErrorMessage:eS,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:JN,getSparseReshapeNegativeOutputDimErrorMessage:YN,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:aS,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:nS,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:rS,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:sS,getUndoAxesPermutation:xg,isIdentityPermutation:UN,log:$f,mergeRealAndImagArrays:DN,prepareAndValidate:bp,prepareSplitSize:HN,segment_util:lS,shouldFuse:wr,slice_util:_p,splitRealAndImagArrays:FN,stridesOrDilationsArePositive:Et,tupleValuesAreOne:ln,upcastType:ar,validateDefaultValueShape:gN,validateInput:mr,validateUpdateShape:aa,warn:Je},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fS=Object.freeze(Object.defineProperty({__proto__:null,nonMaxSuppressionV3Impl:ep,nonMaxSuppressionV4Impl:tp,nonMaxSuppressionV5Impl:np,whereImpl:Wh},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */w1();const mS=Object.freeze(Object.defineProperty({__proto__:null,Abs:wo,Acos:No,Acosh:So,AdadeltaOptimizer:la,AdagradOptimizer:ca,AdamOptimizer:ha,AdamaxOptimizer:pa,Add:ps,AddN:To,All:$o,Any:Eo,ArgMax:ko,ArgMin:vo,Asin:_o,Asinh:Io,Atan:xo,Atan2:Oo,Atanh:Ao,AvgPool:Do,AvgPool3D:Fo,AvgPool3DGrad:sf,AvgPoolGrad:rf,BatchMatMul:Co,BatchToSpaceND:Ro,Bincount:Po,BitwiseAnd:Lo,BroadcastArgs:Bo,BroadcastTo:af,Cast:fs,Ceil:zo,ClipByValue:Vo,Complex:jo,ComplexAbs:Mo,Concat:Wo,Conv2D:qo,Conv2DBackpropFilter:Uo,Conv2DBackpropInput:Go,Conv3D:Ho,Conv3DBackpropFilterV2:of,Conv3DBackpropInputV2:Ko,Cos:Xo,Cosh:Zo,CropAndResize:Qo,Cumprod:Jo,Cumsum:Yo,DataStorage:Rp,DenseBincount:ei,DepthToSpace:ti,DepthwiseConv2dNative:ni,DepthwiseConv2dNativeBackpropFilter:ri,DepthwiseConv2dNativeBackpropInput:si,Diag:ai,Dilation2D:oi,Dilation2DBackpropFilter:lf,Dilation2DBackpropInput:uf,Draw:ms,get ENV(){return cs},Einsum:ui,Elu:li,EluGrad:cf,Environment:yo,Equal:hi,Erf:ci,Exp:pi,ExpandDims:fi,Expm1:mi,FFT:di,Fill:gi,FlipLeftRight:yi,Floor:bi,FloorDiv:wi,FromPixels:Ar,FusedBatchNorm:Ni,FusedConv2D:Dr,FusedDepthwiseConv2D:Fr,GatherNd:Ti,GatherV2:Si,Greater:$i,GreaterEqual:Ei,IFFT:ki,Identity:ds,Imag:vi,IsFinite:_i,IsInf:Ii,IsNan:xi,KernelBackend:ao,LRN:zi,LRNGrad:mf,LeakyRelu:Ai,Less:Oi,LessEqual:Di,LinSpace:Fi,Log:Ci,Log1p:Ri,LogSoftmax:pf,LogicalAnd:Pi,LogicalNot:Li,LogicalOr:Bi,LogicalXor:hf,LowerBound:ff,MatrixBandPart:df,Max:Vi,MaxPool:Mi,MaxPool3D:Wi,MaxPool3DGrad:yf,MaxPoolGrad:gf,MaxPoolWithArgmax:qi,Maximum:ji,Mean:Ui,Min:Gi,Minimum:Hi,MirrorPad:Ki,Mod:Xi,MomentumOptimizer:fa,Multinomial:Zi,Multiply:Ji,Neg:Yi,NonMaxSuppressionV3:eu,NonMaxSuppressionV4:tu,NonMaxSuppressionV5:nu,NotEqual:Qi,OP_SCOPE_SUFFIX:ws,OneHot:su,OnesLike:ru,Optimizer:ht,OptimizerConstructors:Ip,Pack:au,PadV2:ou,Pool:bf,Pow:iu,Prelu:uu,Prod:lu,RMSPropOptimizer:ma,RaggedGather:cu,RaggedRange:hu,RaggedTensorToTensor:pu,Range:fu,get Rank(){return Pr},Real:mu,RealDiv:ii,Reciprocal:du,get Reduction(){return me},Relu:gu,Relu6:Nu,Reshape:yu,ResizeBilinear:wu,ResizeBilinearGrad:Nf,ResizeNearestNeighbor:bu,ResizeNearestNeighborGrad:wf,Reverse:Su,RotateWithOffset:il,Round:Tu,Rsqrt:$u,SGDOptimizer:Nr,ScatterNd:Eu,SearchSorted:vu,Select:_u,Selu:Iu,Sigmoid:Fu,Sign:Du,Sin:Au,Sinh:Ou,Slice:xu,Softmax:zu,Softplus:Cu,SpaceToBatchND:Lu,SparseFillEmptyRows:Vu,SparseReshape:ju,SparseSegmentMean:Mu,SparseSegmentSum:Wu,SparseToDense:qu,SplitV:Bu,Sqrt:Ru,Square:Sf,SquaredDifference:Uu,StaticRegexReplace:Gu,Step:ol,StridedSlice:Hu,StringNGrams:Ku,StringSplit:Xu,StringToHashBucketFast:Zu,Sub:Ju,Sum:Pu,Tan:Yu,Tanh:Qu,Tensor:ne,TensorBuffer:Kn,TensorScatterUpdate:ku,Tile:gs,TopK:el,Transform:tl,Transpose:Dn,Unique:nl,Unpack:rl,UnsortedSegmentSum:sl,UpperBound:Tf,Variable:sn,ZerosLike:al,_FusedMatMul:Or,abs:Se,acos:Pl,acosh:Ll,add:L,addN:Bl,all:zl,any:Vl,argMax:jl,argMin:Ml,asin:Wl,asinh:ql,atan:Ul,atan2:Gl,atanh:Hl,avgPool:vs,avgPool3d:Jl,backend:El,backend_util:pS,basicLSTMCell:Yl,batchNorm:Sn,batchNorm2d:Ql,batchNorm3d:ec,batchNorm4d:tc,batchToSpaceND:_s,bincount:Is,bitwiseAnd:nc,booleanMaskAsync:qh,broadcastArgs:rc,broadcastTo:Qt,broadcast_util:gg,browser:X1,buffer:Be,cast:J,ceil:sc,clipByValue:ac,clone:Ge,complex:Ke,concat:he,concat1d:oc,concat2d:ic,concat3d:uc,concat4d:lc,conv1d:cc,conv2d:Tn,conv2dTranspose:pc,conv3d:fc,conv3dTranspose:mc,copyRegisteredKernels:_f,cos:dc,cosh:gc,cosineWindow:dr,cumprod:yc,cumsum:bc,customGrad:Ve,denseBincount:wc,deprecationWarn:cm,depthToSpace:Nc,depthwiseConv2d:or,device_util:sm,diag:Sc,dilation2d:Tc,disableDeprecationWarnings:lm,dispose:de,disposeVariables:hm,div:Z,divNoNan:Ec,dot:kc,dropout:Xh,einsum:dt,elu:Os,enableDebugMode:um,enableProdMode:im,enclosingPowerOfTwo:ia,engine:pm,ensureShape:vc,env:B,equal:As,erf:_c,euclideanNorm:Ac,exp:it,expandDims:Me,expm1:Oc,eye:Fs,fft:hr,fill:qt,findBackend:wm,findBackendFactory:Nm,floor:Cs,floorDiv:Es,fused:Jh,gather:Rs,gatherND:Kh,gather_util:Z1,getBackend:$l,getGradient:Cr,getKernel:nn,getKernelsForBackend:Gn,grad:sy,grads:ay,greater:kn,greaterEqual:Ps,ifft:fn,imag:vn,image:ap,inTopKAsync:Zh,io:ya,irfft:ta,isFinite:Dc,isInf:Fc,isNaN:Cc,keep:Oe,kernel_impls:fS,leakyRelu:Ls,less:Yn,lessEqual:ir,linalg:op,linspace:Rc,localResponseNormalization:Pc,log:zt,log1p:Bs,logSigmoid:Bc,logSoftmax:zc,logSumExp:Vs,logicalAnd:cn,logicalNot:js,logicalOr:Ms,logicalXor:Vc,losses:ip,lowerBound:jc,matMul:q,math:z1,max:Nt,maxPool:Ws,maxPool3d:Mc,maxPoolWithArgmax:Wc,maximum:qs,mean:hn,memory:fm,meshgrid:qc,min:Jn,minimum:pn,mirrorPad:Uc,mod:Gc,moments:Hc,movingAverage:Uh,mul:F,multiRNNCell:Kc,multinomial:Xc,neg:Fe,nextFrame:cN,norm:En,notEqual:Us,oneHot:Qn,ones:tt,onesLike:Zc,op:N,outerProduct:Jc,pad:Ut,pad1d:Yc,pad2d:Qc,pad3d:eh,pad4d:th,pool:nh,pow:Bt,prelu:Hs,print:$s,prod:rh,profile:mm,raggedGather:sh,raggedRange:ah,raggedTensorToTensor:oh,rand:ih,randomGamma:ch,randomNormal:Ys,randomStandardNormal:hh,randomUniform:cr,randomUniformInt:ph,range:Vt,ready:ym,real:jt,reciprocal:fh,registerBackend:Sm,registerGradient:Ef,registerKernel:ul,relu:_n,relu6:Qs,removeBackend:bm,reshape:I,reverse:ut,reverse1d:mh,reverse2d:dh,reverse3d:gh,reverse4d:yh,rfft:pr,round:ea,rsqrt:bh,scalar:M,scatterND:Gh,scatter_util:l0,searchSorted:lr,selu:wh,separableConv2d:Nh,serialization:y1,setBackend:gm,setPlatform:Tm,setdiff1dAsync:Sh,sigmoid:wt,sign:Th,signal:sp,sin:$h,sinh:Eh,slice:H,slice1d:kh,slice2d:vh,slice3d:_h,slice4d:Ih,slice_util:_p,softmax:xh,softplus:zs,spaceToBatchND:Gs,sparse:up,sparseToDense:Hh,spectral:rp,split:Mt,sqrt:ze,square:Ie,squaredDifference:na,squeeze:fr,stack:je,step:ra,stridedSlice:Ah,string:lp,sub:j,sum:X,sumOutType:Xf,tan:Oh,tanh:Zn,tensor:De,tensor1d:ke,tensor2d:Ct,tensor3d:sa,tensor4d:Dh,tensor5d:Fh,tensor6d:Ch,tensorScatterUpdate:Ph,tensor_util:Yf,test_util:Tb,tidy:U,tile:Ft,time:dm,topk:Lh,train:uN,transpose:mn,truncatedNormal:Bh,unique:zh,unregisterGradient:vf,unregisterKernel:kf,unsortedSegmentSum:Vh,unstack:ct,upcastType:ar,upperBound:jh,util:Bf,valueAndGrad:oy,valueAndGrads:iy,variable:Mh,variableGrads:Lc,version_core:iN,where:He,whereAsync:oa,zeros:kt,zerosLike:Te},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dS=B();dS.registerFlag("KEEP_INTERMEDIATE_TENSORS",()=>!1,t=>{t&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */var we;(function(t){t[t.DT_INVALID=0]="DT_INVALID",t[t.DT_FLOAT=1]="DT_FLOAT",t[t.DT_DOUBLE=2]="DT_DOUBLE",t[t.DT_INT32=3]="DT_INT32",t[t.DT_UINT8=4]="DT_UINT8",t[t.DT_INT16=5]="DT_INT16",t[t.DT_INT8=6]="DT_INT8",t[t.DT_STRING=7]="DT_STRING",t[t.DT_COMPLEX64=8]="DT_COMPLEX64",t[t.DT_INT64=9]="DT_INT64",t[t.DT_BOOL=10]="DT_BOOL",t[t.DT_QINT8=11]="DT_QINT8",t[t.DT_QUINT8=12]="DT_QUINT8",t[t.DT_QINT32=13]="DT_QINT32",t[t.DT_BFLOAT16=14]="DT_BFLOAT16",t[t.DT_QINT16=15]="DT_QINT16",t[t.DT_QUINT16=16]="DT_QUINT16",t[t.DT_UINT16=17]="DT_UINT16",t[t.DT_COMPLEX128=18]="DT_COMPLEX128",t[t.DT_HALF=19]="DT_HALF",t[t.DT_RESOURCE=20]="DT_RESOURCE",t[t.DT_VARIANT=21]="DT_VARIANT",t[t.DT_UINT32=22]="DT_UINT32",t[t.DT_UINT64=23]="DT_UINT64",t[t.DT_FLOAT_REF=101]="DT_FLOAT_REF",t[t.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",t[t.DT_INT32_REF=103]="DT_INT32_REF",t[t.DT_UINT8_REF=104]="DT_UINT8_REF",t[t.DT_INT16_REF=105]="DT_INT16_REF",t[t.DT_INT8_REF=106]="DT_INT8_REF",t[t.DT_STRING_REF=107]="DT_STRING_REF",t[t.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",t[t.DT_INT64_REF=109]="DT_INT64_REF",t[t.DT_BOOL_REF=110]="DT_BOOL_REF",t[t.DT_QINT8_REF=111]="DT_QINT8_REF",t[t.DT_QUINT8_REF=112]="DT_QUINT8_REF",t[t.DT_QINT32_REF=113]="DT_QINT32_REF",t[t.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",t[t.DT_QINT16_REF=115]="DT_QINT16_REF",t[t.DT_QUINT16_REF=116]="DT_QUINT16_REF",t[t.DT_UINT16_REF=117]="DT_UINT16_REF",t[t.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",t[t.DT_HALF_REF=119]="DT_HALF_REF",t[t.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",t[t.DT_VARIANT_REF=121]="DT_VARIANT_REF",t[t.DT_UINT32_REF=122]="DT_UINT32_REF",t[t.DT_UINT64_REF=123]="DT_UINT64_REF"})(we||(we={}));var Ha;(function(t){(function(e){e[e.LEGACY=0]="LEGACY",e[e.V1=1]="V1",e[e.V2=2]="V2"})(t.CheckpointFormatVersion||(t.CheckpointFormatVersion={}))})(Ha||(Ha={}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wa={};function gS(t,e){const n={tfOpName:t,category:"custom",inputs:[],attrs:[],customExecutor:e};wa[t]=n}function xp(t){return wa[t]}function yS(t){delete wa[t]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function p(t,e,n,r,s){const a=e.inputParams[t];if(a&&a.inputIndexStart!==void 0){const i=a.inputIndexStart,u=a.inputIndexEnd===0?void 0:a.inputIndexEnd===void 0?i+1:a.inputIndexEnd,l=i<0?e.inputNames.length+i:i;if(a.type==="tensor")return le(e.inputNames[l],n,r,s);if(a.type==="tensors"){const f=e.inputs.slice(i,u);return e.inputNames.slice(i,u).filter((b,T)=>{var w;return((w=f[T])===null||w===void 0?void 0:w.op)!=="NoOp"}).map(b=>le(b,n,r,s))}const h=le(e.inputNames[l],n,r,s),c=h.dataSync();return a.type==="number"?c[0]:bt(h.shape,c)}const o=e.attrParams[t];return o&&o.value}function le(t,e,n,r){const[s,a]=Ne(t,n);if(r!=null){const i=r.getHashTableHandleByName(s);if(i!=null)return i}const o=n.currentContextIds.find(i=>!!e[tr(s,i)]);return o!==void 0?e[tr(s,o)][a]:void 0}function Ka(t,e,n){return e[tr(t,n.currentContextId)]}function We(t,e){const[n,r,s]=Ne(t,e);return[tr(n,e&&e.currentContextId),r,s]}function tr(t,e){return e?`${t}-${e}`:t}function Ne(t,e){if(t==="")return["",0,void 0];const n=e!=null&&e.parseNodeNameCache!=null;if(n){const a=e.parseNodeNameCache.get(t);if(a!=null)return a}const r=t.split(":");let s;if(r.length===1)s=[t,0,void 0];else{const a=r[0],o=r.length===3?r[1]:void 0,i=Number(r[r.length-1]);s=[a,i,o]}return n&&e.parseNodeNameCache.set(t,s),s}function Mn(t,e,n){let r=p("pad",t,e,n);if(r==="explicit"){r=p("explicitPaddings",t,e,n);const s=[[0,0],[0,0],[0,0],[0,0]];for(let a=0;a<4;a++)s[a][0]=r[a*2],s[a][1]=r[a*2+1];return s}return r}function qe(t){return t.kept?t:Ge(t)}/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bS=[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],wS=Object.freeze(Object.defineProperty({__proto__:null,json:bS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const NS=[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsFinite",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsInf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],SS=Object.freeze(Object.defineProperty({__proto__:null,json:NS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const TS=[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}],$S=Object.freeze(Object.defineProperty({__proto__:null,json:TS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ES=[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}],kS=Object.freeze(Object.defineProperty({__proto__:null,json:ES},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vS=[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniformInt",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number"},{tfName:"maxval",name:"maxval",type:"number"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}],_S=Object.freeze(Object.defineProperty({__proto__:null,json:vS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const IS=[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}],xS=Object.freeze(Object.defineProperty({__proto__:null,json:IS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const AS=[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}],OS=Object.freeze(Object.defineProperty({__proto__:null,json:AS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const DS=[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}],FS=Object.freeze(Object.defineProperty({__proto__:null,json:DS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const CS=[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"InitializeTable",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]},{tfOpName:"InitializeTableV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]}],RS=Object.freeze(Object.defineProperty({__proto__:null,json:CS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const PS=[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}],LS=Object.freeze(Object.defineProperty({__proto__:null,json:PS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const BS=[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BitwiseAnd",category:"logical",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}]}],zS=Object.freeze(Object.defineProperty({__proto__:null,json:BS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const VS=[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"MatrixBandPart",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"numLower",type:"tensor"},{start:1,name:"numUpper",type:"tensor"}]}],jS=Object.freeze(Object.defineProperty({__proto__:null,json:VS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const MS=[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]}],WS=Object.freeze(Object.defineProperty({__proto__:null,json:MS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qS=[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}],US=Object.freeze(Object.defineProperty({__proto__:null,json:qS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const GS=[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]},{tfOpName:"TensorScatterUpdate",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"values",type:"tensor"}]}],HS=Object.freeze(Object.defineProperty({__proto__:null,json:GS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const KS=[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}],XS=Object.freeze(Object.defineProperty({__proto__:null,json:KS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ZS=[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}],JS=Object.freeze(Object.defineProperty({__proto__:null,json:ZS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const YS=[{tfOpName:"StaticRegexReplace",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"pattern",name:"pattern",type:"string"},{tfName:"rewrite",name:"rewrite",type:"string"},{tfName:"replace_global",name:"replaceGlobal",type:"bool"}]},{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}],QS=Object.freeze(Object.defineProperty({__proto__:null,json:YS},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const eT=[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"EnsureShape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}],tT=Object.freeze(Object.defineProperty({__proto__:null,json:eT},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Xa{static get Instance(){return this._instance||(this._instance=new this)}constructor(){const e=[wS,SS,$S,kS,_S,xS,OS,FS,RS,LS,zS,jS,WS,US,HS,XS,JS,QS,tT],n=[].concat(...e.map(r=>r.json));this.opMappers=n.reduce((r,s)=>(r[s.tfOpName]=s,r),{})}transformGraph(e,n={}){const r=e.node,s=[],a=[],o=[],i=r.reduce((T,w)=>(T[w.name]=this.mapNode(w),w.op.startsWith("Placeholder")?s.push(T[w.name]):w.op==="Const"?a.push(T[w.name]):(w.input==null||w.input.length===0)&&o.push(T[w.name]),T),{});let u=[];const l=[];let h={},c={};n!=null&&(h=this.mapSignatureEntries(n.inputs),c=this.mapSignatureEntries(n.outputs));const f=Object.keys(i);f.forEach(T=>{const w=i[T];w.inputNames.forEach(($,O)=>{const[v,,_]=We($),x=i[v];if(x.outputs!=null){const D=x.outputs.indexOf(_);if(D!==-1){const P=`${v}:${D}`;w.inputNames[O]=P}}w.inputs.push(x),x.children.push(w)})}),Object.keys(c).length===0?f.forEach(T=>{const w=i[T];w.children.length===0&&l.push(w)}):Object.keys(c).forEach(T=>{const[w]=We(T),$=i[w];$!=null&&($.signatureKey=c[T],l.push($))}),Object.keys(h).length>0?Object.keys(h).forEach(T=>{const[w]=We(T),$=i[w];$&&($.signatureKey=h[T],u.push($))}):u=s;let m={};e.library!=null&&e.library.function!=null&&(m=e.library.function.reduce((T,w)=>(T[w.signature.name]=this.mapFunction(w),T),{}));const b={nodes:i,inputs:u,outputs:l,weights:a,placeholders:s,signature:n,functions:m};return o.length>0&&(b.initNodes=o),b}mapSignatureEntries(e){return Object.keys(e||{}).reduce((n,r)=>(n[e[r].name]=r,n),{})}mapNode(e){const n=xp(e.op)||this.opMappers[e.op]||{};e.attr==null&&(e.attr={});const r={name:e.name,op:e.op,category:n.category,inputNames:(e.input||[]).map(s=>s.startsWith("^")?s.slice(1):s),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:n.outputs};return n.inputs!=null&&(r.inputParams=n.inputs.reduce((s,a)=>(s[a.name]={type:a.type,inputIndexStart:a.start,inputIndexEnd:a.end},s),{})),n.attrs!=null&&(r.attrParams=n.attrs.reduce((s,a)=>{const o=a.type;let i;switch(a.type){case"string":i=Zr(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Zr(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"string[]":i=rs(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=rs(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"number":i=Yr(e.attr,a.tfName,a.defaultValue||0),i===void 0&&a.tfDeprecatedName&&(i=Yr(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"number[]":i=ns(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=ns(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"bool":i=Jr(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Jr(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"bool[]":i=as(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=as(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"shape":i=ts(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=ts(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"shape[]":i=ss(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=ss(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"dtype":i=Qr(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Qr(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"dtype[]":i=es(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=es(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"func":i=Za(e.attr,a.tfName,a.defaultValue),i===void 0&&a.tfDeprecatedName&&(i=Za(e.attr,a.tfDeprecatedName,a.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${a.type} for op: ${e.op}`)}return s[a.name]={value:i,type:o},s},{})),r}mapFunction(e){const n=e.nodeDef,r=[],s=[];let a={};n!=null&&(a=n.reduce((c,f)=>(c[f.name]=this.mapNode(f),f.op==="Const"&&s.push(c[f.name]),c),{}));const o=[],i=[];e.signature.inputArg.forEach(c=>{const[f]=We(c.name),m={name:f,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:Na(c.type),type:"dtype"}},children:[]};m.signatureKey=c.name,o.push(m),a[f]=m}),Object.keys(a).forEach(c=>{const f=a[c];f.inputNames.forEach((m,b)=>{const[T,,w]=We(m),$=a[T];if($.outputs!=null){const O=$.outputs.indexOf(w);if(O!==-1){const v=`${T}:${O}`;f.inputNames[b]=v}}f.inputs.push($),$.children.push(f)})});const l=e.ret;e.signature.outputArg.forEach(c=>{const[f,m]=We(l[c.name]),b=a[f];b!=null&&(b.defaultOutput=m,i.push(b))});const h=this.mapArgsToSignature(e);return{nodes:a,inputs:o,outputs:i,weights:s,placeholders:r,signature:h}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce((n,r)=>(n[r.name]=this.mapArgToTensorInfo(r),n),{}),outputs:e.signature.outputArg.reduce((n,r)=>(n[r.name]=this.mapArgToTensorInfo(r,e.ret),n),{})}}mapArgToTensorInfo(e,n){let r=e.name;return n!=null&&(r=n[r]),{name:r,dtype:e.type}}}function nT(t){const e=B().global;if(typeof e.atob<"u")return e.atob(t);if(typeof Buffer<"u")return new Buffer(t,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}function Ap(t,e){const n=Array.isArray(t)?String.fromCharCode.apply(null,t):nT(t);return e?n:n.toLowerCase()}function Zr(t,e,n,r=!1){const s=t[e];return s!=null?Ap(s.s,r):n}function Jr(t,e,n){const r=t[e];return r?r.b:n}function Yr(t,e,n){const r=t[e]||{},s=r.i!=null?r.i:r.f!=null?r.f:n;return typeof s=="number"?s:parseInt(s,10)}function Na(t){switch(typeof t=="string"&&(t=we[t]),t){case we.DT_FLOAT:case we.DT_HALF:return"float32";case we.DT_INT32:case we.DT_INT64:case we.DT_INT8:case we.DT_UINT8:return"int32";case we.DT_BOOL:return"bool";case we.DT_DOUBLE:return"float32";case we.DT_STRING:return"string";case we.DT_COMPLEX64:case we.DT_COMPLEX128:return"complex64";default:return null}}function Za(t,e,n){const r=t[e];return r&&r.func?r.func.name:n}function Qr(t,e,n){const r=t[e];return r&&r.type?Na(r.type):n}function es(t,e,n){const r=t[e];return r&&r.list&&r.list.type?r.list.type.map(s=>Na(s)):n}function Op(t){if(!t.unknownRank)return t.dim!=null?t.dim.map(e=>typeof e.size=="number"?e.size:parseInt(e.size,10)):[]}function ts(t,e,n){const r=t[e];return r&&r.shape?Op(r.shape):n}function ns(t,e,n){const r=t[e];return r?((r.list.f&&r.list.f.length?r.list.f:r.list.i)||[]).map(s=>typeof s=="number"?s:parseInt(s,10)):n}function rs(t,e,n,r=!1){const s=t[e];return s&&s.list&&s.list.s?s.list.s.map(a=>Ap(a,r)):n}function ss(t,e,n){const r=t[e];return r&&r.list&&r.list.shape?r.list.shape.map(s=>Op(s)):n}function as(t,e,n){const r=t[e];return r&&r.list&&r.list.b?r.list.b:n}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class rT{constructor(e,n,r){this.node=e,this.tensorMap=n,this.context=r,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map(s=>this.getInput(s)),e.rawAttrs!=null&&(this.attrs=Object.keys(e.rawAttrs).reduce((s,a)=>(s[a]=this.getAttr(a),s),{}))}getInput(e){return le(e,this.tensorMap,this.context)}getAttr(e,n){const r=this.node.rawAttrs[e];if(r.tensor!=null)return le(e,this.tensorMap,this.context);if(r.i!=null||r.f!=null)return Yr(this.node.rawAttrs,e,n);if(r.s!=null)return Zr(this.node.rawAttrs,e,n);if(r.b!=null)return Jr(this.node.rawAttrs,e,n);if(r.shape!=null)return ts(this.node.rawAttrs,e,n);if(r.type!=null)return Qr(this.node.rawAttrs,e,n);if(r.list!=null){if(r.list.i!=null||r.list.f!=null)return ns(this.node.rawAttrs,e,n);if(r.list.s!=null)return rs(this.node.rawAttrs,e,n);if(r.list.shape!=null)return ss(this.node.rawAttrs,e,n);if(r.list.b!=null)return as(this.node.rawAttrs,e,n);if(r.list.type!=null)return es(this.node.rawAttrs,e,n)}return n}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ce=Object.freeze(Object.defineProperty({__proto__:null,OP_SCOPE_SUFFIX:ws,abs:Se,acos:Pl,acosh:Ll,add:L,addN:Bl,all:zl,any:Vl,argMax:jl,argMin:Ml,asin:Wl,asinh:ql,atan:Ul,atan2:Gl,atanh:Hl,avgPool:vs,avgPool3d:Jl,basicLSTMCell:Yl,batchNorm:Sn,batchNorm2d:Ql,batchNorm3d:ec,batchNorm4d:tc,batchToSpaceND:_s,bincount:Is,bitwiseAnd:nc,booleanMaskAsync:qh,broadcastArgs:rc,broadcastTo:Qt,buffer:Be,cast:J,ceil:sc,clipByValue:ac,clone:Ge,complex:Ke,concat:he,concat1d:oc,concat2d:ic,concat3d:uc,concat4d:lc,conv1d:cc,conv2d:Tn,conv2dTranspose:pc,conv3d:fc,conv3dTranspose:mc,cos:dc,cosh:gc,cosineWindow:dr,cumprod:yc,cumsum:bc,denseBincount:wc,depthToSpace:Nc,depthwiseConv2d:or,diag:Sc,dilation2d:Tc,div:Z,divNoNan:Ec,dot:kc,dropout:Xh,einsum:dt,elu:Os,enclosingPowerOfTwo:ia,ensureShape:vc,equal:As,erf:_c,euclideanNorm:Ac,exp:it,expandDims:Me,expm1:Oc,eye:Fs,fft:hr,fill:qt,floor:Cs,floorDiv:Es,fused:Jh,gather:Rs,gatherND:Kh,greater:kn,greaterEqual:Ps,ifft:fn,imag:vn,image:ap,inTopKAsync:Zh,irfft:ta,isFinite:Dc,isInf:Fc,isNaN:Cc,leakyRelu:Ls,less:Yn,lessEqual:ir,linalg:op,linspace:Rc,localResponseNormalization:Pc,log:zt,log1p:Bs,logSigmoid:Bc,logSoftmax:zc,logSumExp:Vs,logicalAnd:cn,logicalNot:js,logicalOr:Ms,logicalXor:Vc,losses:ip,lowerBound:jc,matMul:q,max:Nt,maxPool:Ws,maxPool3d:Mc,maxPoolWithArgmax:Wc,maximum:qs,mean:hn,meshgrid:qc,min:Jn,minimum:pn,mirrorPad:Uc,mod:Gc,moments:Hc,movingAverage:Uh,mul:F,multiRNNCell:Kc,multinomial:Xc,neg:Fe,norm:En,notEqual:Us,oneHot:Qn,ones:tt,onesLike:Zc,op:N,outerProduct:Jc,pad:Ut,pad1d:Yc,pad2d:Qc,pad3d:eh,pad4d:th,pool:nh,pow:Bt,prelu:Hs,print:$s,prod:rh,raggedGather:sh,raggedRange:ah,raggedTensorToTensor:oh,rand:ih,randomGamma:ch,randomNormal:Ys,randomStandardNormal:hh,randomUniform:cr,randomUniformInt:ph,range:Vt,real:jt,reciprocal:fh,relu:_n,relu6:Qs,reshape:I,reverse:ut,reverse1d:mh,reverse2d:dh,reverse3d:gh,reverse4d:yh,rfft:pr,round:ea,rsqrt:bh,scalar:M,scatterND:Gh,searchSorted:lr,selu:wh,separableConv2d:Nh,setdiff1dAsync:Sh,sigmoid:wt,sign:Th,signal:sp,sin:$h,sinh:Eh,slice:H,slice1d:kh,slice2d:vh,slice3d:_h,slice4d:Ih,softmax:xh,softplus:zs,spaceToBatchND:Gs,sparse:up,sparseToDense:Hh,spectral:rp,split:Mt,sqrt:ze,square:Ie,squaredDifference:na,squeeze:fr,stack:je,step:ra,stridedSlice:Ah,string:lp,sub:j,sum:X,tan:Oh,tanh:Zn,tensor:De,tensor1d:ke,tensor2d:Ct,tensor3d:sa,tensor4d:Dh,tensor5d:Fh,tensor6d:Ch,tensorScatterUpdate:Ph,tile:Ft,topk:Lh,transpose:mn,truncatedNormal:Bh,unique:zh,unsortedSegmentSum:Vh,unstack:ct,upperBound:jh,variable:Mh,where:He,whereAsync:oa,zeros:kt,zerosLike:Te},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sT=(t,e,n,r=ce)=>{switch(t.op){case"BiasAdd":case"AddV2":case"Add":return[r.add(p("a",t,e,n),p("b",t,e,n))];case"AddN":return[r.addN(p("tensors",t,e,n))];case"FloorMod":case"Mod":return[r.mod(p("a",t,e,n),p("b",t,e,n))];case"Mul":return[r.mul(p("a",t,e,n),p("b",t,e,n))];case"RealDiv":case"Div":return[r.div(p("a",t,e,n),p("b",t,e,n))];case"DivNoNan":return[r.divNoNan(p("a",t,e,n),p("b",t,e,n))];case"FloorDiv":return[r.floorDiv(p("a",t,e,n),p("b",t,e,n))];case"Sub":return[r.sub(p("a",t,e,n),p("b",t,e,n))];case"Minimum":return[r.minimum(p("a",t,e,n),p("b",t,e,n))];case"Maximum":return[r.maximum(p("a",t,e,n),p("b",t,e,n))];case"Pow":return[r.pow(p("a",t,e,n),p("b",t,e,n))];case"SquaredDifference":return[r.squaredDifference(p("a",t,e,n),p("b",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const aT=(t,e,n,r=ce)=>{switch(t.op){case"Abs":case"ComplexAbs":return[r.abs(p("x",t,e,n))];case"Acos":return[r.acos(p("x",t,e,n))];case"Acosh":return[r.acosh(p("x",t,e,n))];case"Asin":return[r.asin(p("x",t,e,n))];case"Asinh":return[r.asinh(p("x",t,e,n))];case"Atan":return[r.atan(p("x",t,e,n))];case"Atan2":return[r.atan2(p("x",t,e,n),p("y",t,e,n))];case"Atanh":return[r.atanh(p("x",t,e,n))];case"Ceil":return[r.ceil(p("x",t,e,n))];case"Complex":return[r.complex(p("real",t,e,n),p("imag",t,e,n))];case"Cos":return[r.cos(p("x",t,e,n))];case"Cosh":return[r.cosh(p("x",t,e,n))];case"Elu":return[r.elu(p("x",t,e,n))];case"Erf":return[r.erf(p("x",t,e,n))];case"Exp":return[r.exp(p("x",t,e,n))];case"Expm1":return[r.expm1(p("x",t,e,n))];case"Floor":return[r.floor(p("x",t,e,n))];case"Log":return[r.log(p("x",t,e,n))];case"Log1p":return[r.log1p(p("x",t,e,n))];case"Imag":return[r.imag(p("x",t,e,n))];case"Neg":return[r.neg(p("x",t,e,n))];case"Reciprocal":return[r.reciprocal(p("x",t,e,n))];case"Real":return[r.real(p("x",t,e,n))];case"Relu":return[r.relu(p("x",t,e,n))];case"Round":return[r.round(p("x",t,e,n))];case"Selu":return[r.selu(p("x",t,e,n))];case"Sigmoid":return[r.sigmoid(p("x",t,e,n))];case"Sin":return[r.sin(p("x",t,e,n))];case"Sign":return[r.sign(p("x",t,e,n))];case"Sinh":return[r.sinh(p("x",t,e,n))];case"Softplus":return[r.softplus(p("x",t,e,n))];case"Sqrt":return[r.sqrt(p("x",t,e,n))];case"Square":return[r.square(p("x",t,e,n))];case"Tanh":return[r.tanh(p("x",t,e,n))];case"Tan":return[r.tan(p("x",t,e,n))];case"ClipByValue":return[r.clipByValue(p("x",t,e,n),p("clipValueMin",t,e,n),p("clipValueMax",t,e,n))];case"Relu6":return[r.relu6(p("x",t,e,n))];case"Rsqrt":return[r.rsqrt(le(t.inputNames[0],e,n))];case"LeakyRelu":return[r.leakyRelu(p("x",t,e,n),p("alpha",t,e,n))];case"Prelu":return[r.prelu(p("x",t,e,n),p("alpha",t,e,n))];case"IsNan":return[r.isNaN(le(t.inputNames[0],e,n))];case"IsInf":return[r.isInf(le(t.inputNames[0],e,n))];case"IsFinite":return[r.isFinite(le(t.inputNames[0],e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _e(t,e,n=""){if(!(typeof t=="number"||typeof e=="number")){g(t.length===e.length,()=>n+` Shapes ${t} and ${e} must match`);for(let r=0;r<t.length;r++){const s=t[r],a=e[r];g(s<0||a<0||s===a,()=>n+` Shapes ${t} and ${e} must match`)}}}function Ja(t){return!(typeof t=="number"||t.some(e=>e<0))}function Kt(t,e,n){let r=os(t,n);const s=!Ja(r);if(s&&e.length===0)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${r}`);if(s&&e.forEach(a=>{r=os(a.shape,r)}),!Ja(r))throw new Error(`Non-fully-defined elementShape: ${r}`);return r}function os(t,e){if(typeof t=="number")return e;if(typeof e=="number")return t;if(t.length!==e.length)throw new Error(`Incompatible ranks during merge: ${t} vs. ${e}`);const n=[];for(let r=0;r<t.length;++r){const s=t[r],a=e[r];if(s>=0&&a>=0&&s!==a)throw new Error(`Incompatible shape during merge: ${t} vs. ${e}`);n[r]=s>=0?s:a}return n}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class oT{constructor(e,n,r,s,a,o,i){this.name=e,this.dtype=n,this.maxSize=r,this.elementShape=s,this.identicalElementShapes=a,this.dynamicSize=o,this.clearAfterRead=i,this.tensors=[],this.closed_=!1,this.idTensor=M(0),Oe(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach(n=>{(e==null||!e.has(n.tensor.id))&&n.tensor.dispose()}),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);const n=this.tensors[e];if(n.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(n.cleared=!0),n.read=!0,n.tensor}readMany(e){return e.map(n=>this.read(n))}write(e,n){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);const r=this.tensors[e]||{};if(n.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},
          because the value dtype is ${n.dtype}, but TensorArray dtype is ${this.dtype}.`);if(this.size()===0&&(this.elementShape==null||this.elementShape.length===0)&&(this.elementShape=n.shape),_e(this.elementShape,n.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),r.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(r.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);r.tensor=n,Oe(n),r.written=!0,this.tensors[e]=r}writeMany(e,n){if(e.length!==n.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${n.length}.`);e.forEach((r,s)=>this.write(r,n[s]))}gather(e,n){if(n&&n!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${n}`);if(e)e=e.slice(0,this.size());else{e=[];for(let s=0;s<this.size();s++)e.push(s)}if(e.length===0)return De([],[0].concat(this.elementShape));const r=this.readMany(e);return _e(this.elementShape,r[0].shape,"TensorArray shape mismatch: "),je(r,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(this.size()===0)return De([],[0].concat(this.elementShape));const n=[];for(let s=0;s<this.size();s++)n.push(s);const r=this.readMany(n);return _e(this.elementShape,r[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${r[0].shape})`),he(r,0)}scatter(e,n){if(n.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${n.dtype}`);if(e.length!==n.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${n.shape[0]}`);const r=Math.max(...e);if(!this.dynamicSize&&r>=this.maxSize)throw new Error(`Max index must be < array size (${r}  vs. ${this.maxSize})`);this.writeMany(e,ct(n,0))}split(e,n){if(n.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${n.dtype}`);let r=0;const s=e.map(u=>(r+=u,r));if(r!==n.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${r}, and tensor's shape is: ${n.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);const a=r===0?0:n.size/r,o=[];U(()=>{n=I(n,[1,r,a]);for(let u=0;u<e.length;++u){const h=[0,u===0?0:s[u-1],0],c=[1,e[u],a];o[u]=I(H(n,h,c),this.elementShape)}return o});const i=[];for(let u=0;u<e.length;u++)i[u]=u;this.writeMany(i,o)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class _t{get id(){return this.idTensor.id}constructor(e,n,r,s=-1){this.tensors=e,this.elementShape=n,this.elementDtype=r,e!=null&&e.forEach(a=>{if(r!==a.dtype)throw new Error(`Invalid data types; op elements ${r}, but list elements ${a.dtype}`);_e(n,a.shape,"TensorList shape mismatch: "),Oe(a)}),this.idTensor=M(0),this.maxNumElements=s,Oe(this.idTensor)}copy(){return new _t([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach(n=>{(e==null||!e.has(n.id))&&n.dispose()}),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,n,r=-1){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(r!==-1&&this.tensors.length!==r)throw new Error(`Operation expected a list with ${r} elements but got a list with ${this.tensors.length} elements.`);_e(e,this.elementShape,"TensorList shape mismatch: ");const s=Kt(this.elementShape,this.tensors,e);return U(()=>{const a=this.tensors.map(o=>I(o,s));return je(a,0)})}popBack(e,n){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(this.size()===0)throw new Error("Trying to pop from an empty list.");const r=Kt(this.elementShape,this.tensors,e),s=this.tensors.pop();return s.kept=!1,_e(s.shape,e,"TensorList shape mismatch: "),I(s,r)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(_e(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");Oe(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(this.maxNumElements!==-1&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);const n=new _t([],this.elementShape,this.elementDtype,this.maxNumElements);n.tensors.length=e;for(let r=0;r<Math.min(this.tensors.length,e);++r)n.tensors[r]=this.tensors[r];return n}getItem(e,n,r){if(r!==this.elementDtype)throw new Error(`Invalid data types; op elements ${r}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(this.tensors[e]==null)throw new Error(`element at index ${e} is null.`);_e(this.tensors[e].shape,n,"TensorList shape mismatch: ");const s=Kt(this.elementShape,this.tensors,n);return I(this.tensors[e],s)}setItem(e,n){if(n.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n.dtype}, but list elements ${this.elementDtype}`);if(e<0||this.maxNumElements!==-1&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);_e(this.elementShape,n.shape,"TensorList shape mismatch: "),Oe(n),this.tensors[e]!=null&&(this.tensors[e].kept=!1),this.tensors[e]=n}gather(e,n,r){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);_e(this.elementShape,r,"TensorList shape mismatch: "),e=e.slice(0,this.size());const s=Kt(this.elementShape,this.tensors,r);return e.length===0?De([],[0].concat(s)):U(()=>{const a=e.map(o=>I(this.tensors[o],s));return je(a,0)})}concat(e,n){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);_e(this.elementShape,n,"TensorList shape mismatch: ");const r=Kt(this.elementShape,this.tensors,n);return this.size()===0?De([],[0].concat(r)):U(()=>{const s=this.tensors.map(a=>I(a,r));return he(s,0)})}}function iT(t,e,n){const r=t.dtype;if(t.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${t.shape}`);if(t.dtype!==n)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${n}`);const s=t.shape.slice(1);_e(s,e,"TensorList shape mismatch: ");const a=ct(t);return new _t(a,e,r)}function uT(t,e,n,r){return new _t([],t,e,r)}function lT(t,e,n,r){if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);const s=Math.max(...e);if(r!=null&&r!==-1&&s>=r)throw new Error(`Max index must be < array size (${s}  vs. ${r})`);const a=new _t([],n,t.dtype,r),o=ct(t,0);return e.forEach((i,u)=>{a.setItem(i,o[u])}),a}function cT(t,e,n){let r=0;const s=e.map(h=>(r+=h,r));if(r!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${r}, and tensor's shape is: ${t.shape}`);const a=t.shape.slice(1),o=os(a,n),i=r===0?0:t.size/r,u=U(()=>{const h=[];t=I(t,[1,r,i]);for(let c=0;c<e.length;++c){const m=[0,c===0?0:s[c-1],0],b=[1,e[c],i];h[c]=I(H(t,m,b),o)}return t.dispose(),h}),l=new _t([],n,t.dtype,e.length);for(let h=0;h<u.length;h++)l.setItem(h,u[h]);return l}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hT=async(t,e,n)=>{switch(t.op){case"If":case"StatelessIf":{const r=p("thenBranch",t,e,n),s=p("elseBranch",t,e,n),a=p("cond",t,e,n),o=p("args",t,e,n);return(await a.data())[0]?n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[s].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case"While":case"StatelessWhile":{const r=p("body",t,e,n),s=p("cond",t,e,n),a=p("args",t,e,n),o=await n.functionMap[s].executeFunctionAsync(a,n.tensorArrayMap,n.tensorListMap),i=a.map(h=>h.id);let u=await o[0].data();o.forEach(h=>{!h.kept&&i.indexOf(h.id)===-1&&h.dispose()});let l=a;for(;u[0];){const h=l;l=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);const c=l.map(m=>m.id);h.forEach(m=>{!m.kept&&i.indexOf(m.id)===-1&&c.indexOf(m.id)===-1&&m.dispose()});const f=await n.functionMap[s].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);u=await f[0].data(),f.forEach(m=>{!m.kept&&i.indexOf(m.id)===-1&&c.indexOf(m.id)===-1&&m.dispose()})}return l}case"LoopCond":{const r=p("pred",t,e,n);return[qe(r)]}case"Switch":{const r=p("pred",t,e,n);let s=p("data",t,e,n);return s.kept||(s=qe(s)),(await r.data())[0]?[void 0,s]:[s,void 0]}case"Merge":{const r=t.inputNames.find(s=>le(s,e,n)!==void 0);if(r){const s=le(r,e,n);return[qe(s)]}return}case"Enter":{const r=p("frameName",t,e,n),s=p("tensor",t,e,n);return n.enterFrame(r),[qe(s)]}case"Exit":{const r=p("tensor",t,e,n);return n.exitFrame(),[qe(r)]}case"NextIteration":{const r=p("tensor",t,e,n);return n.nextIteration(),[qe(r)]}case"TensorArrayV3":{const r=p("size",t,e,n),s=p("dtype",t,e,n),a=p("elementShape",t,e,n),o=p("dynamicSize",t,e,n),i=p("clearAfterRead",t,e,n),u=p("identicalElementShapes",t,e,n),l=p("name",t,e,n),h=new oT(l,s,r,a,u,o,i);return n.addTensorArray(h),[h.idTensor,M(1)]}case"TensorArrayWriteV3":{const r=p("tensorArrayId",t,e,n),s=p("index",t,e,n),a=p("tensor",t,e,n),o=n.getTensorArray(r.id);return o.write(s,a),[o.idTensor]}case"TensorArrayReadV3":{const r=p("tensorArrayId",t,e,n),s=p("index",t,e,n);return[n.getTensorArray(r.id).read(s)]}case"TensorArrayGatherV3":{const r=p("tensorArrayId",t,e,n),s=p("indices",t,e,n),a=p("dtype",t,e,n);return[n.getTensorArray(r.id).gather(s,a)]}case"TensorArrayScatterV3":{const r=p("tensorArrayId",t,e,n),s=p("indices",t,e,n),a=p("tensor",t,e,n),o=n.getTensorArray(r.id);return o.scatter(s,a),[o.idTensor]}case"TensorArrayConcatV3":{const r=p("tensorArrayId",t,e,n),s=n.getTensorArray(r.id),a=p("dtype",t,e,n);return[s.concat(a)]}case"TensorArraySplitV3":{const r=p("tensorArrayId",t,e,n),s=p("tensor",t,e,n),a=p("lengths",t,e,n),o=n.getTensorArray(r.id);return o.split(a,s),[o.idTensor]}case"TensorArraySizeV3":{const r=p("tensorArrayId",t,e,n),s=n.getTensorArray(r.id);return[M(s.size(),"int32")]}case"TensorArrayCloseV3":{const r=p("tensorArrayId",t,e,n),s=n.getTensorArray(r.id);return s.clearAndClose(),[s.idTensor]}case"TensorListSetItem":{const r=p("tensorListId",t,e,n),s=p("index",t,e,n),a=p("tensor",t,e,n),o=n.getTensorList(r.id);return o.setItem(s,a),[o.idTensor]}case"TensorListGetItem":{const r=p("tensorListId",t,e,n),s=p("index",t,e,n),a=p("elementShape",t,e,n),o=p("elementDType",t,e,n);return[n.getTensorList(r.id).getItem(s,a,o)]}case"TensorListScatterV2":case"TensorListScatter":{const r=p("indices",t,e,n),s=p("tensor",t,e,n),a=p("elementShape",t,e,n),o=p("numElements",t,e,n),i=lT(s,r,a,o);return n.addTensorList(i),[i.idTensor]}case"TensorListReserve":case"EmptyTensorList":{const r=p("elementShape",t,e,n),s=p("elementDType",t,e,n);let a;t.op==="TensorListReserve"?a="numElements":a="maxNumElements";const o=p(a,t,e,n),i=t.op==="TensorListReserve"?-1:o,u=uT(r,s,o,i);return n.addTensorList(u),[u.idTensor]}case"TensorListGather":{const r=p("tensorListId",t,e,n),s=p("indices",t,e,n),a=p("elementShape",t,e,n),o=p("elementDType",t,e,n);return[n.getTensorList(r.id).gather(s,o,a)]}case"TensorListStack":{const r=p("tensorListId",t,e,n),s=p("elementShape",t,e,n),a=p("elementDType",t,e,n),o=p("numElements",t,e,n);return[n.getTensorList(r.id).stack(s,a,o)]}case"TensorListFromTensor":{const r=p("tensor",t,e,n),s=p("elementShape",t,e,n),a=p("elementDType",t,e,n),o=iT(r,s,a);return n.addTensorList(o),[o.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{const r=p("tensorListId",t,e,n),s=n.getTensorList(r.id),a=p("dtype",t,e,n),o=p("elementShape",t,e,n);return[s.concat(a,o)]}case"TensorListPushBack":{const r=p("tensorListId",t,e,n),s=p("tensor",t,e,n),a=n.getTensorList(r.id);return a.pushBack(s),[a.idTensor]}case"TensorListPopBack":{const r=p("tensorListId",t,e,n),s=p("elementShape",t,e,n),a=p("elementDType",t,e,n);return[n.getTensorList(r.id).popBack(s,a)]}case"TensorListSplit":{const r=p("tensor",t,e,n),s=p("elementShape",t,e,n),a=p("lengths",t,e,n),o=cT(r,a,s);return n.addTensorList(o),[o.idTensor]}case"TensorListLength":{const r=p("tensorListId",t,e,n),s=n.getTensorList(r.id);return[M(s.size(),"int32")]}case"TensorListResize":{const r=p("tensorListId",t,e,n),s=p("size",t,e,n),o=n.getTensorList(r.id).resize(s);return n.addTensorList(o),[o.idTensor]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ya(t,e,n){const[r,s]=p("fusedOps",t,e,n),a=r==="biasadd",o=!a,i=s==="prelu",u=r==="fusedbatchnorm",l=p("numArgs",t,e,n);if(a){if(i&&l!==2)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&a&&l!==1)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");const h=p("strides",t,e,n),c=Mn(t,e,n),f=p("dataFormat",t,e,n).toUpperCase(),m=p("dilations",t,e,n);let[b,T]=p("args",t,e,n);o&&(T=b,b=void 0);const w=p("leakyreluAlpha",t,e,n);return{stride:h,pad:c,dataFormat:f,dilations:m,biasArg:b,preluArg:T,activationFunc:s,leakyreluAlpha:w}}const pT=(t,e,n,r=ce)=>{switch(t.op){case"Conv1D":{const s=p("stride",t,e,n),a=p("pad",t,e,n),o=p("dataFormat",t,e,n).toUpperCase(),i=p("dilation",t,e,n);return[r.conv1d(p("x",t,e,n),p("filter",t,e,n),s,a,o,i)]}case"Conv2D":{const s=p("strides",t,e,n),a=Mn(t,e,n),o=p("dataFormat",t,e,n).toUpperCase(),i=p("dilations",t,e,n);return[r.conv2d(p("x",t,e,n),p("filter",t,e,n),[s[1],s[2]],a,o,[i[1],i[2]])]}case"_FusedConv2D":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:h,leakyreluAlpha:c}=Ya(t,e,n);return[r.fused.conv2d({x:p("x",t,e,n),filter:p("filter",t,e,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:h,preluActivationWeights:l,leakyreluAlpha:c})]}case"FusedDepthwiseConv2dNative":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:h,leakyreluAlpha:c}=Ya(t,e,n);return[r.fused.depthwiseConv2d({x:p("x",t,e,n),filter:p("filter",t,e,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:h,preluActivationWeights:l,leakyreluAlpha:c})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{const s=p("outputShape",t,e,n),a=p("strides",t,e,n),o=Mn(t,e,n);return[r.conv2dTranspose(p("x",t,e,n),p("filter",t,e,n),s,[a[1],a[2]],o)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{const s=p("strides",t,e,n),a=Mn(t,e,n),o=p("dilations",t,e,n),i=p("dataFormat",t,e,n).toUpperCase();return[r.depthwiseConv2d(p("input",t,e,n),p("filter",t,e,n),[s[1],s[2]],a,i,[o[1],o[2]])]}case"Conv3D":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("dataFormat",t,e,n).toUpperCase(),i=p("dilations",t,e,n);return[r.conv3d(p("x",t,e,n),p("filter",t,e,n),[s[1],s[2],s[3]],a,o,[i[1],i[2],i[3]])]}case"AvgPool":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("kernelSize",t,e,n);return[r.avgPool(p("x",t,e,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPool":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("kernelSize",t,e,n);return[r.maxPool(p("x",t,e,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPoolWithArgmax":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("kernelSize",t,e,n),i=p("includeBatchInIndex",t,e,n),{result:u,indexes:l}=r.maxPoolWithArgmax(p("x",t,e,n),[o[1],o[2]],[s[1],s[2]],a,i);return[u,l]}case"AvgPool3D":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("kernelSize",t,e,n);return[r.avgPool3d(p("x",t,e,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"MaxPool3D":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("kernelSize",t,e,n);return[r.maxPool3d(p("x",t,e,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"Dilation2D":{const s=p("strides",t,e,n),a=p("pad",t,e,n),o=p("dilations",t,e,n),i=s[1],u=s[2],l=o[1],h=o[2];return[r.dilation2d(p("x",t,e,n),p("filter",t,e,n),[i,u],a,[l,h],"NHWC")]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fT=(t,e,n,r=ce)=>{switch(t.op){case"Fill":{const s=p("shape",t,e,n),a=p("dtype",t,e,n),o=p("value",t,e,n);return[r.fill(s,o,a)]}case"LinSpace":{const s=p("start",t,e,n),a=p("stop",t,e,n),o=p("num",t,e,n);return[r.linspace(s,a,o)]}case"Multinomial":{const s=p("logits",t,e,n),a=p("numSamples",t,e,n),o=p("seed",t,e,n);return[r.multinomial(s,a,o)]}case"OneHot":{const s=p("indices",t,e,n),a=p("depth",t,e,n),o=p("onValue",t,e,n),i=p("offValue",t,e,n),u=p("dtype",t,e,n);return[r.oneHot(s,a,o,i,u)]}case"Ones":return[r.ones(p("shape",t,e,n),p("dtype",t,e,n))];case"OnesLike":return[r.onesLike(p("x",t,e,n))];case"RandomStandardNormal":return[r.randomStandardNormal(p("shape",t,e,n),p("dtype",t,e,n),p("seed",t,e,n))];case"RandomUniform":return[r.randomUniform(p("shape",t,e,n),p("minval",t,e,n),p("maxval",t,e,n),p("dtype",t,e,n))];case"RandomUniformInt":return[r.randomUniformInt(p("shape",t,e,n),p("minval",t,e,n),p("maxval",t,e,n),p("seed",t,e,n))];case"Range":{const s=p("start",t,e,n),a=p("stop",t,e,n),o=p("step",t,e,n);return[r.range(s,a,o,p("dtype",t,e,n))]}case"TruncatedNormal":{const s=p("shape",t,e,n),a=p("mean",t,e,n),o=p("stdDev",t,e,n),i=p("seed",t,e,n);return[r.truncatedNormal(s,a,o,p("dtype",t,e,n),i)]}case"Zeros":return[r.zeros(p("shape",t,e,n),p("dtype",t,e,n))];case"ZerosLike":return[r.zerosLike(p("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xr(t,e,n){const r=p("boxes",t,e,n),s=p("scores",t,e,n),a=p("maxOutputSize",t,e,n),o=p("iouThreshold",t,e,n),i=p("scoreThreshold",t,e,n),u=p("softNmsSigma",t,e,n);return{boxes:r,scores:s,maxOutputSize:a,iouThreshold:o,scoreThreshold:i,softNmsSigma:u}}const mT=async(t,e,n,r,s=ce)=>{switch(t.op){case"NonMaxSuppressionV5":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l,softNmsSigma:h}=xr(t,e,n),c=await s.image.nonMaxSuppressionWithScoreAsync(a,o,i,u,l,h);return[c.selectedIndices,c.selectedScores]}case"NonMaxSuppressionV4":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l}=xr(t,e,n),h=p("padToMaxOutputSize",t,e,n),c=await s.image.nonMaxSuppressionPaddedAsync(a,o,i,u,l,h);return[c.selectedIndices,c.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{const{boxes:a,scores:o,maxOutputSize:i,iouThreshold:u,scoreThreshold:l}=xr(t,e,n);return[await s.image.nonMaxSuppressionAsync(a,o,i,u,l)]}case"Where":{const a=s.cast(p("condition",t,e,n),"bool"),o=[await s.whereAsync(a)];return a.dispose(),o}case"ListDiff":return s.setdiff1dAsync(p("x",t,e,n),p("y",t,e,n));default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dT=(t,e,n,r=ce)=>{switch(t.op){case"LowerBound":{const s=p("sortedSequence",t,e,n),a=p("values",t,e,n);return[r.lowerBound(s,a)]}case"TopKV2":{const s=p("x",t,e,n),a=p("k",t,e,n),o=p("sorted",t,e,n),i=r.topk(s,a,o);return[i.values,i.indices]}case"UpperBound":{const s=p("sortedSequence",t,e,n),a=p("values",t,e,n);return[r.upperBound(s,a)]}case"Unique":{const s=p("x",t,e,n),a=r.unique(s);return[a.values,a.indices]}case"UniqueV2":{const s=p("x",t,e,n),a=p("axis",t,e,n),o=r.unique(s,a);return[o.values,o.indices]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gT=(t,e,n,r=ce)=>{switch(t.op){case"Const":return e[t.name];case"PlaceholderWithDefault":const s=p("default",t,e,n);return[le(t.name,e,n)||s];case"Placeholder":return[le(t.name,e,n)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":{const h=p("x",t,e,n);return[qe(h)]}case"IdentityN":return p("x",t,e,n).map(h=>qe(h));case"Snapshot":const a=p("x",t,e,n);return[qe(a)];case"Shape":return[r.tensor1d(p("x",t,e,n).shape,"int32")];case"ShapeN":return p("x",t,e,n).map(h=>r.tensor1d(h.shape));case"Size":return[r.scalar(p("x",t,e,n).size,"int32")];case"Rank":return[r.scalar(p("x",t,e,n).rank,"int32")];case"NoOp":return[r.scalar(1)];case"Print":const o=p("x",t,e,n),i=p("data",t,e,n),u=p("message",t,e,n),l=p("summarize",t,e,n);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(u);for(let h=0;h<i.length;h++)console.log(Array.prototype.slice.call(i[h].dataSync()).slice(0,l));return[o];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class yT{get id(){return this.handle.id}constructor(e,n){this.keyDType=e,this.valueDType=n,this.handle=M(0),this.tensorMap=new Map,Oe(this.handle)}clearAndClose(){this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return M(this.size(),"int32")}async import(e,n){this.checkKeyAndValueTensor(e,n);const r=await e.data();return this.tensorMap.forEach(s=>s.dispose()),this.tensorMap.clear(),U(()=>{const s=ct(n),a=r.length,o=s.length;g(a===o,()=>`The number of elements doesn't match, keys has ${a} elements, the values has ${o} elements.`);for(let i=0;i<a;i++){const u=r[i],l=s[i];Oe(l),this.tensorMap.set(u,l)}return this.handle})}async find(e,n){this.checkKeyAndValueTensor(e,n);const r=await e.data();return U(()=>{const s=[];for(let a=0;a<r.length;a++){const o=r[a],i=this.findWithDefault(o,n);s.push(i)}return je(s)})}findWithDefault(e,n){const r=this.tensorMap.get(e);return r??n}checkKeyAndValueTensor(e,n){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(n.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${n.dtype}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bT=async(t,e,n,r)=>{switch(t.op){case"HashTable":case"HashTableV2":{const s=r.getHashTableHandleByName(t.name);if(s!=null)return[s];{const a=p("keyDType",t,e,n),o=p("valueDType",t,e,n),i=new yT(a,o);return r.addHashTable(t.name,i),[i.handle]}}case"InitializeTable":case"InitializeTableV2":case"LookupTableImport":case"LookupTableImportV2":{const s=p("tableHandle",t,e,n,r),a=p("keys",t,e,n),o=p("values",t,e,n);return[await r.getHashTableById(s.id).import(a,o)]}case"LookupTableFind":case"LookupTableFindV2":{const s=p("tableHandle",t,e,n,r),a=p("keys",t,e,n),o=p("defaultValue",t,e,n);return[await r.getHashTableById(s.id).find(a,o)]}case"LookupTableSize":case"LookupTableSizeV2":{const s=p("tableHandle",t,e,n,r);return[r.getHashTableById(s.id).tensorSize()]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wT=(t,e,n,r=ce)=>{switch(t.op){case"ResizeBilinear":{const s=p("images",t,e,n),a=p("size",t,e,n),o=p("alignCorners",t,e,n),i=p("halfPixelCenters",t,e,n);return[r.image.resizeBilinear(s,[a[0],a[1]],o,i)]}case"ResizeNearestNeighbor":{const s=p("images",t,e,n),a=p("size",t,e,n),o=p("alignCorners",t,e,n),i=p("halfPixelCenters",t,e,n);return[r.image.resizeNearestNeighbor(s,[a[0],a[1]],o,i)]}case"CropAndResize":{const s=p("image",t,e,n),a=p("boxes",t,e,n),o=p("boxInd",t,e,n),i=p("cropSize",t,e,n),u=p("method",t,e,n),l=p("extrapolationValue",t,e,n);return[r.image.cropAndResize(s,a,o,i,u,l)]}case"ImageProjectiveTransformV3":{const s=p("images",t,e,n),a=p("transforms",t,e,n),o=p("outputShape",t,e,n),i=p("fillValue",t,e,n),u=p("interpolation",t,e,n),l=p("fillMode",t,e,n);return[r.image.transform(s,a,u.toLowerCase(),l.toLowerCase(),i,o)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const NT=(t,e,n,r=ce)=>{switch(t.op){case"Equal":return[r.equal(p("a",t,e,n),p("b",t,e,n))];case"NotEqual":return[r.notEqual(p("a",t,e,n),p("b",t,e,n))];case"Greater":return[r.greater(p("a",t,e,n),p("b",t,e,n))];case"GreaterEqual":return[r.greaterEqual(p("a",t,e,n),p("b",t,e,n))];case"Less":return[r.less(p("a",t,e,n),p("b",t,e,n))];case"LessEqual":return[r.lessEqual(p("a",t,e,n),p("b",t,e,n))];case"LogicalAnd":return[r.logicalAnd(p("a",t,e,n),p("b",t,e,n))];case"LogicalNot":return[r.logicalNot(p("a",t,e,n))];case"LogicalOr":return[r.logicalOr(p("a",t,e,n),p("b",t,e,n))];case"Select":case"SelectV2":return[r.where(p("condition",t,e,n),p("a",t,e,n),p("b",t,e,n))];case"BitwiseAnd":return[r.bitwiseAnd(p("a",t,e,n),p("b",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ST=(t,e,n,r=ce)=>{switch(t.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[r.matMul(p("a",t,e,n),p("b",t,e,n),p("transposeA",t,e,n),p("transposeB",t,e,n))];case"Einsum":return[r.einsum(p("equation",t,e,n),...p("tensors",t,e,n))];case"Transpose":return[r.transpose(p("x",t,e,n),p("perm",t,e,n))];case"_FusedMatMul":const[s,a]=p("fusedOps",t,e,n),o=s==="biasadd",i=a==="prelu",u=p("numArgs",t,e,n),l=p("leakyreluAlpha",t,e,n);if(o){if(i&&u!==2)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&u!==1)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}const[h,c]=p("args",t,e,n);return[r.fused.matMul({a:p("a",t,e,n),b:p("b",t,e,n),transposeA:p("transposeA",t,e,n),transposeB:p("transposeB",t,e,n),bias:h,activation:a,preluActivationWeights:c,leakyreluAlpha:l})];case"MatrixBandPart":return[r.linalg.bandPart(p("a",t,e,n),p("numLower",t,e,n),p("numUpper",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const TT=(t,e,n,r=ce)=>{switch(t.op){case"EuclideanNorm":return[r.euclideanNorm(p("x",t,e,n),p("axis",t,e,n),p("keepDims",t,e,n))];case"FusedBatchNorm":case"FusedBatchNormV2":return[r.batchNorm(p("x",t,e,n),p("mean",t,e,n),p("variance",t,e,n),p("offset",t,e,n),p("scale",t,e,n),p("epsilon",t,e,n))];case"FusedBatchNormV3":return[r.batchNorm(p("x",t,e,n),p("mean",t,e,n),p("variance",t,e,n),p("offset",t,e,n),p("scale",t,e,n),p("epsilon",t,e,n))];case"LRN":return[r.localResponseNormalization(p("x",t,e,n),p("radius",t,e,n),p("bias",t,e,n),p("alpha",t,e,n),p("beta",t,e,n))];case"Softmax":return[r.softmax(p("x",t,e,n))];case"LogSoftmax":return[r.logSoftmax(p("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $T=(t,e,n,r=ce)=>{switch(t.op){case"RaggedGather":{const{outputNestedSplits:s,outputDenseValues:a}=r.raggedGather(p("paramsNestedSplits",t,e,n),p("paramsDenseValues",t,e,n),p("indices",t,e,n),p("outputRaggedRank",t,e,n));return s.concat(a)}case"RaggedRange":{const{rtNestedSplits:s,rtDenseValues:a}=r.raggedRange(p("starts",t,e,n),p("limits",t,e,n),p("splits",t,e,n));return[s,a]}case"RaggedTensorToTensor":return[r.raggedTensorToTensor(p("shape",t,e,n),p("values",t,e,n),p("defaultValue",t,e,n),p("rowPartitionTensors",t,e,n),p("rowPartitionTypes",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ET=(t,e,n,r=ce)=>{switch(t.op){case"Max":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.max(p("x",t,e,n),i,u)]}case"Mean":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.mean(p("x",t,e,n),i,u)]}case"Min":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.min(p("x",t,e,n),i,u)]}case"Sum":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.sum(p("x",t,e,n),i,u)]}case"All":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.all(p("x",t,e,n),i,u)]}case"Any":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.any(p("x",t,e,n),i,u)]}case"ArgMax":{const i=p("axis",t,e,n);return[r.argMax(p("x",t,e,n),i)]}case"ArgMin":{const i=p("axis",t,e,n);return[r.argMin(p("x",t,e,n),i)]}case"Prod":{const i=p("axis",t,e,n),u=p("keepDims",t,e,n);return[r.prod(p("x",t,e,n),i,u)]}case"Cumprod":{const i=p("axis",t,e,n),u=p("exclusive",t,e,n),l=p("reverse",t,e,n);return[r.cumprod(p("x",t,e,n),i,u,l)]}case"Cumsum":{const i=p("axis",t,e,n),u=p("exclusive",t,e,n),l=p("reverse",t,e,n);return[r.cumsum(p("x",t,e,n),i,u,l)]}case"Bincount":const s=p("x",t,e,n),a=p("weights",t,e,n),o=p("size",t,e,n);return[r.bincount(s,a,o)];case"DenseBincount":{const i=p("x",t,e,n),u=p("weights",t,e,n),l=p("size",t,e,n),h=p("binaryOutput",t,e,n);return[r.denseBincount(i,u,l,h)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const kT=(t,e,n,r=ce)=>{switch(t.op){case"ConcatV2":case"Concat":{const s=p("n",t,e,n),a=p("axis",t,e,n);let o=p("tensors",t,e,n);return o=o.slice(0,s),[r.concat(o,a)]}case"Gather":{const s=p("x",t,e,n),a=p("indices",t,e,n);return[r.gather(s,r.cast(a,"int32"),0)]}case"GatherV2":{const s=p("axis",t,e,n),a=p("batchDims",t,e,n),o=p("x",t,e,n),i=p("indices",t,e,n);return[r.gather(o,r.cast(i,"int32"),s,a)]}case"Reverse":{const s=p("dims",t,e,n),a=[];for(let i=0;i<s.length;i++)s[i]&&a.push(i);const o=p("x",t,e,n);return[r.reverse(o,a)]}case"ReverseV2":{const s=p("axis",t,e,n),a=p("x",t,e,n);return[r.reverse(a,s)]}case"Slice":{const s=p("begin",t,e,n),a=p("size",t,e,n);return[r.slice(p("x",t,e,n),s,a)]}case"StridedSlice":{const s=p("begin",t,e,n),a=p("end",t,e,n),o=p("strides",t,e,n),i=p("beginMask",t,e,n),u=p("endMask",t,e,n),l=p("ellipsisMask",t,e,n),h=p("newAxisMask",t,e,n),c=p("shrinkAxisMask",t,e,n),f=p("x",t,e,n);return[r.stridedSlice(f,s,a,o,i,u,l,h,c)]}case"Pack":return U(()=>{const s=p("axis",t,e,n),a=p("tensors",t,e,n),o=a[0].shape,i=r.squeeze(a[0]).shape,u=a.map(l=>{const h=Ce(l.shape,o);if(!h&&!Ce(r.squeeze(l).shape,i))throw new Error("the input tensors shape does not match");return h?l:r.reshape(l,o)});return[r.stack(u,s)]});case"Unpack":{const s=p("axis",t,e,n),a=p("tensor",t,e,n);return r.unstack(a,s)}case"Tile":{const s=p("reps",t,e,n);return[r.tile(p("x",t,e,n),s)]}case"Split":case"SplitV":{const s=p("axis",t,e,n),a=p("numOrSizeSplits",t,e,n),o=p("x",t,e,n);return r.split(o,a,s)}case"ScatterNd":{const s=p("indices",t,e,n),a=p("values",t,e,n),o=p("shape",t,e,n);return[r.scatterND(s,a,o)]}case"GatherNd":{const s=p("x",t,e,n),a=p("indices",t,e,n);return[r.gatherND(s,a)]}case"SparseToDense":{const s=p("sparseIndices",t,e,n),a=p("outputShape",t,e,n),o=p("sparseValues",t,e,n),i=p("defaultValue",t,e,n);return[r.sparseToDense(s,o,a,o.dtype===i.dtype?i:r.cast(i,o.dtype))]}case"TensorScatterUpdate":{const s=p("indices",t,e,n),a=p("values",t,e,n),o=p("tensor",t,e,n);return[r.tensorScatterUpdate(o,s,a)]}default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vT=(t,e,n,r=ce)=>{switch(t.op){case"SparseFillEmptyRows":{const{outputIndices:s,outputValues:a,emptyRowIndicator:o,reverseIndexMap:i}=r.sparse.sparseFillEmptyRows(p("indices",t,e,n),p("values",t,e,n),p("denseShape",t,e,n),p("defaultValue",t,e,n));return[s,a,o,i]}case"SparseReshape":{const{outputIndices:s,outputShape:a}=r.sparse.sparseReshape(p("inputIndices",t,e,n),p("inputShape",t,e,n),p("newShape",t,e,n));return[s,a]}case"SparseSegmentMean":return[r.sparse.sparseSegmentMean(p("data",t,e,n),p("indices",t,e,n),p("segmentIds",t,e,n))];case"SparseSegmentSum":return[r.sparse.sparseSegmentSum(p("data",t,e,n),p("indices",t,e,n),p("segmentIds",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _T=(t,e,n,r=ce)=>{switch(t.op){case"FFT":return[r.fft(p("x",t,e,n))];case"IFFT":return[r.ifft(p("x",t,e,n))];case"RFFT":return[r.rfft(p("x",t,e,n))];case"IRFFT":return[r.irfft(p("x",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const IT=(t,e,n,r=ce)=>{switch(t.op){case"StaticRegexReplace":return[r.string.staticRegexReplace(p("input",t,e,n),p("pattern",t,e,n),p("rewrite",t,e,n),p("replaceGlobal",t,e,n))];case"StringNGrams":{const{nGrams:s,nGramsSplits:a}=r.string.stringNGrams(p("data",t,e,n),p("dataSplits",t,e,n),p("separator",t,e,n),p("nGramWidths",t,e,n),p("leftPad",t,e,n),p("rightPad",t,e,n),p("padWidth",t,e,n),p("preserveShortSequences",t,e,n));return[s,a]}case"StringSplit":{const{indices:s,values:a,shape:o}=r.string.stringSplit(p("input",t,e,n),p("delimiter",t,e,n),p("skipEmpty",t,e,n));return[s,a,o]}case"StringToHashBucketFast":return[r.string.stringToHashBucketFast(p("input",t,e,n),p("numBuckets",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xT=(t,e,n,r=ce)=>{switch(t.op){case"Cast":return[r.cast(p("x",t,e,n),p("dtype",t,e,n))];case"ExpandDims":{const s=p("axis",t,e,n);return[r.expandDims(p("x",t,e,n),s)]}case"Squeeze":{const s=p("axis",t,e,n);return[r.squeeze(p("x",t,e,n),s)]}case"Reshape":return[r.reshape(p("x",t,e,n),p("shape",t,e,n))];case"EnsureShape":return[r.ensureShape(p("x",t,e,n),p("shape",t,e,n))];case"MirrorPad":return[r.mirrorPad(p("x",t,e,n),p("padding",t,e,n),p("mode",t,e,n))];case"PadV2":case"Pad":return[r.pad(p("x",t,e,n),p("padding",t,e,n),p("constantValue",t,e,n))];case"SpaceToBatchND":{const s=p("blockShape",t,e,n),a=p("paddings",t,e,n);return[r.spaceToBatchND(p("x",t,e,n),s,a)]}case"BatchToSpaceND":{const s=p("blockShape",t,e,n),a=p("crops",t,e,n);return[r.batchToSpaceND(p("x",t,e,n),s,a)]}case"DepthToSpace":{const s=p("blockSize",t,e,n),a=p("dataFormat",t,e,n).toUpperCase();return[r.depthToSpace(p("x",t,e,n),s,a)]}case"BroadcastTo":return[r.broadcastTo(p("x",t,e,n),p("shape",t,e,n))];case"BroadcastArgs":return[r.broadcastArgs(p("s0",t,e,n),p("s1",t,e,n))];default:throw TypeError(`Node type ${t.op} is not implemented`)}};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qa(t,e,n,r,s=U){const a=((o,i,u)=>{switch(o.category){case"arithmetic":return s(()=>sT(o,i,u));case"basic_math":return s(()=>aT(o,i,u));case"control":return hT(o,i,u);case"convolution":return s(()=>pT(o,i,u));case"creation":return s(()=>fT(o,i,u));case"dynamic":return mT(o,i,u);case"evaluation":return s(()=>dT(o,i,u));case"image":return s(()=>wT(o,i,u));case"graph":return s(()=>gT(o,i,u));case"logical":return s(()=>NT(o,i,u));case"matrices":return s(()=>ST(o,i,u));case"normalization":return s(()=>TT(o,i,u));case"ragged":return s(()=>$T(o,i,u));case"reduction":return s(()=>ET(o,i,u));case"slice_join":return s(()=>kT(o,i,u));case"sparse":return s(()=>vT(o,i,u));case"spectral":return s(()=>_T(o,i,u));case"string":return s(()=>IT(o,i,u));case"transformation":return s(()=>xT(o,i,u));case"hash_table":return bT(o,i,u,r);case"custom":const l=xp(o.op);if(l&&l.customExecutor)return l.customExecutor(new rT(o,i,u));throw TypeError(`Custom op ${o.op} is not registered.`);default:throw TypeError(`Unknown op '${o.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(t,e,n);return st(a)?a.then(o=>[].concat(o)):[].concat(a)}class eo{constructor(e={},n={},r={},s={},a){this.weightMap=e,this.tensorArrayMap=n,this.tensorListMap=r,this.functionMap=s,this.parseNodeNameCache=a,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,n){return{id:e,frameName:n,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){const e=[];for(let n=0;n<this.contexts.length-1;n++){const r=this.contexts.slice(0,this.contexts.length-n);e.push(this.contextIdforContexts(r))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map(n=>n.id===0&&n.iterationId===0?"":`${n.frameName}-${n.iterationId}`).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(this.contexts&&this.contexts.length>1)this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift();else throw new Error("Cannot exit frame, the context is empty")}nextIteration(){if(this.contexts&&this.contexts.length>0){this.contexts=this.contexts.slice(),this.lastId++;const e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}else throw new Error("Cannot increase frame iteration, the context is empty")}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(const n in this.tensorArrayMap)this.tensorArrayMap[n].clearAndClose(e);for(const n in this.tensorListMap)this.tensorListMap[n].clearAndClose(e)}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function to(t,e,n,r){const s=new Set,a=[];let o=null,i=null;const u=new Set,l=new Set(Object.keys(t).map(f=>Ne(f)[0]));r=r||[];const h=new Set(r.map(f=>Ne(f.name)[0])),c=[...e];for(;c.length>0;){const f=c.pop();if((gt(f)||LT(f)||BT(f))&&o==null&&(o=f,i=o.children.map(m=>m.name).filter(m=>s.has(m))),s.add(f.name),n[f.name]==null&&!l.has(f.name)&&!h.has(f.name)){if(f.inputs.length===0){a.push(f.name);continue}f.inputs.forEach(m=>{u.has(m.name)||(u.add(m.name),c.push(m))})}}return{inputs:t,outputs:e,usedNodes:s,missingInputs:a,dynamicNode:o,syncInputs:i}}function AT(t,e){const{usedNodes:n,inputs:r}=e,s=Object.keys(r).map(w=>Ne(w)[0]).map(w=>t.nodes[w]),a=t.initNodes||[],o=w=>n.has(typeof w=="string"?w:w.name);function i(w){return[...new Map(w.map($=>[$.name,$])).values()]}const u=i([...s,...t.weights,...a]).filter(o),l=i([...u,...Object.values(t.nodes)]).filter(o),h=new Map(l.map(w=>[w.name,w])),c={};for(const w of l){c[w.name]=c[w.name]||0;for(const $ of w.children)o($)||(c[$.name]=Number.POSITIVE_INFINITY),c[$.name]=(c[$.name]||0)+1}const f=Object.entries(c).filter(([,w])=>w===0).map(([w])=>w),m=[...f];for(;f.length>0;){const w=f.pop(),$=h.get(w);for(const O of $.children.filter(o))--c[O.name]===0&&(m.push(O.name),f.push(O.name))}const b=m.map(w=>h.get(w)),T=OT(b,u);return DT(T,u),T}function OT(t,e){const n=new Map(t.map(o=>[o.name,o])),r=e.map(o=>o.name),s=new Set(r);for(;r.length>0;){const o=r.pop(),i=n.get(o);for(const u of i.children)!n.has(u.name)||s.has(u.name)||(s.add(u.name),r.push(u.name))}return t.filter(o=>s.has(o.name))}class On extends Error{constructor(e){super(`NodesExecutionOrderError: ${e}`)}}function DT(t,e){const n=new Map(t.map((i,u)=>[i.name,u])),r=new Set(e.map(i=>i.name)),s=i=>r.has(typeof i=="string"?i:i.name),a=new Set(t.map(i=>i.name)),o=i=>a.has(typeof i=="string"?i:i.name);for(const i of t){for(const u of i.children.filter(o)){if(!n.has(u.name))throw new On(`Child ${u.name} of node ${i.name} is unreachable.`);if(n.get(i.name)>n.get(u.name))throw new On(`Node ${i.name} is scheduled to run after its child ${u.name}.`)}if(!s(i))for(const u of i.inputs){if(!n.has(u.name))throw new On(`Input ${u.name} of node ${i.name} is unreachable.`);if(n.get(u.name)>n.get(i.name))throw new On(`Node ${i.name} is scheduled to run before its input ${u.name}.`)}}}function FT(t){const e=new Map(t.map((i,u)=>[i.name,u])),n=Number.MAX_SAFE_INTEGER,r=t.map((i,u)=>gt(i)?n:u),s=i=>{const u=r[e.get(i.name)];return u??-1},a=t.map((i,u)=>i.children.map(s).reduce((l,h)=>Math.max(l,h),r[u])),o=new Map;for(let i=0;i<t.length;++i){const u=a[i];if(u===n)continue;const l=t[i],h=t[u];o.has(h.name)||o.set(h.name,[]),o.get(h.name).push(l)}return o}const CT=new Set(["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"]),RT=new Set(["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"]),PT=new Set(["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"]);function gt(t){return CT.has(t.op)}function LT(t){return RT.has(t.op)}function BT(t){return PT.has(t.op)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class nr{get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){const n=Object.keys(e).map(r=>e[r].map(s=>s.id));this._weightIds=[].concat(...n),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get outputs(){return this._outputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get inputNodes(){return this._inputs.map(e=>e.signatureKey||e.name)}get outputNodes(){return this._outputs.map(e=>{const n=e.signatureKey||e.name;return e.defaultOutput?`${n}:${e.defaultOutput}`:n})}get functions(){return Object.keys(this._functions).reduce((e,n)=>(e[n]=this._functions[n].signature,e),{})}constructor(e,n){this.graph=e,this.parent=n,this.compiledMap=new Map,this.parseNodeNameCache=new Map,this._weightMap={},this.SEPARATOR=",",this._functions={},this._functionExecutorMap={},this.keepIntermediateTensors=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,e.functions!=null&&Object.keys(e.functions).forEach(r=>{this._functionExecutorMap[r]=new nr(e.functions[r],this)})}getCompilationKey(e,n){const r=e.map(a=>a.name).sort(),s=n.map(a=>a.name).sort();return r.join(this.SEPARATOR)+"--"+s.join(this.SEPARATOR)}compile(e,n){const r=to(e,n,this.weightMap,this._initNodes),{missingInputs:s,dynamicNode:a,syncInputs:o}=r;if(a!=null)throw new Error(`This execution contains the node '${a.name}', which has the dynamic op '${a.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${o}]`);if(s.length>0){const l=n.map(c=>c.name),h=Object.keys(e);throw new Error(`Cannot compute the outputs [${l}] from the provided inputs [${h}]. Missing the following inputs: [${s}]`)}const i=AT(this.graph,r),u=FT(i);return{orderedNodes:i,nodeLiveUntilMap:u}}cloneAndKeepTensor(e){if(e==null)return null;const n=e.clone();return Oe(n),n}cloneTensorList(e){return e?e.map(r=>this.cloneAndKeepTensor(r)):null}cloneTensorMap(e){return Object.fromEntries(Object.entries(e).map(([n,r])=>[n,this.cloneTensorList(r)]))}execute(e,n){this.disposeIntermediateTensors(),e=this.mapInputs(e);const r=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),n=this.mapOutputs(n),this.checkOutputs(n);const s=r.map(f=>this.graph.nodes[Ne(f)[0]]),a=n.map(f=>Ne(f)[0]),o=new Set(a);let i=a.map(f=>this.graph.nodes[f]);i.length===0&&(i=this._outputs);const u=this.getCompilationKey(s,i);let l=this.compiledMap.get(u);l==null&&(l=this.compile(e,i),this.compiledMap.set(u,l));try{this.keepIntermediateTensors=B().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(f){this.keepIntermediateTensors=!1,console.warn(f.message)}const h={},c={};return U(()=>{const f=new eo(this.weightMap,h,c,this.functionExecutorMap,this.parseNodeNameCache),m=Object.assign({},this.weightMap);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap)),Object.keys(e).forEach($=>{const[O,v]=Ne($,f),_=[];_[v]=e[$],m[O]=_,this.keepIntermediateTensors&&(this.clonedTensorsMap[O]=this.cloneTensorList(_))});const b=this.getFrozenTensorIds(m),{orderedNodes:T,nodeLiveUntilMap:w}=l;for(const $ of T){if(m[$.name])continue;const O=Qa($,m,f,this._resourceManager);if(st(O))throw new Error(`The execution of the op '${$.op}' returned a promise. Please use model.executeAsync() instead.`);m[$.name]=O,this.keepIntermediateTensors&&(this.clonedTensorsMap[$.name]=this.cloneTensorList(O)),this.checkTensorForDisposalWithNodeLiveUntilInfo($,m,f,b,o,w.get($.name))}return this.parent==null&&f.dispose(b),n.map($=>le($,m,f))})}getFrozenTensorIds(e){const n=[].concat.apply([],Object.keys(e).map(r=>e[r]).map(r=>r.map(s=>s.id)));return new Set(n)}checkTensorForDisposal(e,n,r,s,a,o,i){if(!(gt(n)||o.has(e))){for(const u of r[e])u!=null&&(i[u.id]=(i[u.id]||0)+n.children.length);for(const u of n.inputs){if(gt(u))continue;const l=Ka(u.name,r,s);if(l!=null)for(const h of l){if(!h||h.kept||a.has(h.id))continue;const c=i[h.id];c===1?(h.dispose(),delete i[h.id]):c!=null&&i[h.id]--}}}}checkTensorForDisposalWithNodeLiveUntilInfo(e,n,r,s,a,o){function i(u){return gt(u)||a.has(u.name)}if(!(gt(e)||o==null))for(const u of o){if(i(u))continue;const l=Ka(u.name,n,r);for(const h of l)!h||h.kept||s.has(h.id)||h.dispose()}}async executeAsync(e,n){return this._executeAsync(e,n)}disposeIntermediateTensors(){this.clonedTensorsMap&&(Object.values(this.clonedTensorsMap).forEach(e=>{for(const n of e)n&&!n.isDisposed&&n.dispose()}),this.clonedTensorsMap=null)}getIntermediateTensors(){return this.clonedTensorsMap}async _executeAsync(e,n,r=!1,s={},a={}){this.disposeIntermediateTensors(),r||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),n=this.mapOutputs(n),this.checkOutputs(n));try{this.keepIntermediateTensors=B().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(f){this.keepIntermediateTensors=!1,console.warn(f.message)}const o=new eo(this.weightMap,s,a,this.functionExecutorMap,this.parseNodeNameCache);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap));const i=await this.executeWithControlFlow(e,o,n,r),u=n.map(f=>le(f,i,o)),l=u.map(f=>f.id),h=Object.keys(e).map(f=>e[f].id),c=new Set([...l,...h,...this.weightIds]);return Object.values(i).forEach(f=>{f.forEach(m=>{m&&!m.isDisposed&&!c.has(m.id)&&m.dispose()})}),this.parent==null&&o.dispose(c),u}async executeFunctionAsync(e,n,r){const s=e.reduce((a,o,i)=>(a[this.inputs[i].name]=o,a),{});return this._executeAsync(s,this.outputNodes,!0,n,r)}async executeWithControlFlow(e,n,r,s){const a=Object.keys(e),o=a.map(_=>this.graph.nodes[Ne(_)[0]]),i=r.map(_=>Ne(_)[0]),u=new Set(i);let l=i.map(_=>this.graph.nodes[_]);l.length===0&&(l=this._outputs);const{usedNodes:h,missingInputs:c,dynamicNode:f,syncInputs:m}=to(e,l,this.weightMap,this._initNodes),b=[...o,...this.graph.weights,...this._initNodes||[]].map(_=>({node:_,contexts:n.currentContext})),T=Object.assign({},this.weightMap);Object.keys(e).forEach(_=>{const[x,D]=Ne(_),P=[];P[D]=e[_],T[x]=P});const w={},$=this.getFrozenTensorIds(T),O={};for(;b.length>0;){const _=this.processStack(o,b,n,T,O,$,u,w,h);await Promise.all(_)}f==null&&!s&&console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");const v=l.filter(_=>!gt(_)&&!le(_.name,T,n)).map(_=>_.name);if(v.length>0){let _="";throw f!=null&&(_=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${m}]`),new Error(`Cannot compute the outputs [${v}] from the provided inputs [${a}]. Consider providing the following inputs: [${c}]. ${_}`)}return T}processStack(e,n,r,s,a,o,i,u,l){const h=[];for(;n.length>0;){const c=n.pop();r.currentContext=c.contexts;let f="";if(c.node.op==="Enter"&&p("isConstant",c.node,s,r)&&([f]=We(c.node.name,r)),s[c.node.name]==null){const m=Qa(c.node,s,r,this._resourceManager);f||([f]=We(c.node.name,r));const b=r.currentContext;st(m)?h.push(m.then(T=>(s[f]=T,this.keepIntermediateTensors&&(this.clonedTensorsMap[f]=this.cloneTensorList(T)),r.currentContext=b,this.checkTensorForDisposal(f,c.node,s,r,o,i,u),this.processChildNodes(c.node,n,r,s,a,l),T))):(s[f]=m,this.keepIntermediateTensors&&(this.clonedTensorsMap[f]=this.cloneTensorList(m)),this.checkTensorForDisposal(f,c.node,s,r,o,i,u),this.processChildNodes(c.node,n,r,s,a,l))}else this.processChildNodes(c.node,n,r,s,a,l)}return h}processChildNodes(e,n,r,s,a,o){e.children.forEach(i=>{const[u]=We(i.name,r);a[u]||!o.has(i.name)||(i.op==="Merge"?i.inputNames.some(l=>!!le(l,s,r))&&(a[u]=!0,n.push({contexts:r.currentContext,node:i})):i.inputNames.every(l=>!!le(l,s,r))&&(a[u]=!0,n.push({contexts:r.currentContext,node:i})))})}dispose(){Object.keys(this.weightMap).forEach(e=>this.weightMap[e].forEach(n=>n.dispose()))}checkInputShapeAndType(e){Object.keys(e).forEach(n=>{const r=e[n],[s]=Ne(n),a=this.graph.nodes[s];if(a.attrParams.shape&&a.attrParams.shape.value){const o=a.attrParams.shape.value,i=o.length===r.shape.length&&r.shape.every((u,l)=>o[l]===-1||o[l]===u);g(i,()=>`The shape of dict['${a.name}'] provided in model.execute(dict) must be [${o}], but was [${r.shape}]`)}a.attrParams.dtype&&a.attrParams.dtype.value&&g(r.dtype===a.attrParams.dtype.value,()=>`The dtype of dict['${a.name}'] provided in model.execute(dict) must be ${a.attrParams.dtype.value}, but was ${r.dtype}`)})}mapInputs(e){var n,r;const s={};for(const a in e){const o=(r=(n=this._signature)===null||n===void 0?void 0:n.inputs)===null||r===void 0?void 0:r[a];o!=null?s[o.name]=e[a]:s[a]=e[a]}return s}checkInputs(e){const n=Object.keys(e).filter(r=>{const[s]=Ne(r);return this.graph.nodes[s]==null});if(n.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${n}] that are not part of graph`)}mapOutputs(e){return e.map(n=>{var r,s;const a=(s=(r=this._signature)===null||r===void 0?void 0:r.outputs)===null||s===void 0?void 0:s[n];return a!=null?a.name:n},{})}checkOutputs(e){e.forEach(n=>{const[r]=Ne(n);if(!this.graph.nodes[r])throw new Error(`The output '${n}' is not found in the graph`)})}}class zT{constructor(e={},n={}){this.hashTableNameToHandle=e,this.hashTableMap=n}addHashTable(e,n){this.hashTableNameToHandle[e]=n.handle,this.hashTableMap[n.id]=n}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(const e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(const e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const VT="?tfjs-format=file",jT="model.json";class Sa{get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}constructor(e,n={},r=ya){this.modelUrl=e,this.loadOptions=n,this.version="n/a",this.io=r,n==null&&(this.loadOptions={}),this.resourceManager=new zT}findIOHandler(){const e=this.modelUrl;if(e.load!=null)this.handler=e;else if(this.loadOptions.requestInit!=null)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{const n=this.io.getLoadHandlers(e,this.loadOptions);if(n.length===0)n.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(n.length>1)throw new Error(`Found more than one (${n.length}) load handlers for URL '${[e]}'`);this.handler=n[0]}}load(){if(this.findIOHandler(),this.handler.load==null)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");const e=this.handler.load();return st(e)?e.then(n=>n.getWeightStream==null?this.loadSync(n):this.loadStreaming(n)):this.loadSync(e)}loadSync(e){const n=this.io.decodeWeights(e.weightData,e.weightSpecs);return this.loadWithWeightMap(e,n)}async loadStreaming(e){if(e.getWeightStream==null)throw new Error("Model artifacts missing streamWeights function");const n=await _l(e.getWeightStream(),e.weightSpecs);return this.loadWithWeightMap(e,n)}loadWithWeightMap(e,n){this.artifacts=e;const r=this.artifacts.modelTopology;let s=this.artifacts.signature;if(this.artifacts.userDefinedMetadata!=null){const a=this.artifacts.userDefinedMetadata;a.signature!=null&&(s=a.signature),a.structuredOutputKeys!=null&&(this.structuredOutputKeys=a.structuredOutputKeys)}if(this.signature=s,this.version=`${r.versions.producer}.${r.versions.minConsumer}`,this.executor=new nr(Xa.Instance.transformGraph(r,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(n),this.executor.resourceManager=this.resourceManager,e.modelInitializer!=null&&e.modelInitializer.node!=null){const a=Xa.Instance.transformGraph(e.modelInitializer);this.initializer=new nr(a),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializerSignature=e.initializerSignature}return!0}async save(e,n){if(typeof e=="string"){const r=this.io.getSaveHandlers(e);if(r.length===0)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(r.length>1)throw new Error(`Found more than one (${r.length}) save handlers for URL '${e}'`);e=r[0]}if(e.save==null)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}addStructuredOutputNames(e){if(this.structuredOutputKeys){const n=e instanceof ne?[e]:e,r={};return n.forEach((s,a)=>r[this.structuredOutputKeys[a]]=s),r}return e}predict(e,n){const r=this.execute(e,this.outputNodes);return this.addStructuredOutputNames(r)}async predictAsync(e,n){const r=await this.executeAsync(e,this.outputNodes);return this.addStructuredOutputNames(r)}normalizeInputs(e){var n;if(!(e instanceof ne)&&!Array.isArray(e)){const a=(n=this.signature)===null||n===void 0?void 0:n.inputs;if(a!=null)for(const o in a){const i=a[o];i.resourceId!=null&&(e[o]=this.resourceIdToCapturedInput[i.resourceId])}return e}e=Array.isArray(e)?e:[e];const r=Object.keys(this.resourceIdToCapturedInput).length;if(e.length+r!==this.inputNodes.length)throw new Error(`Input tensor count mismatch, the graph model has ${this.inputNodes.length-r} non-resource placeholders, while there are ${e.length} input tensors provided.`);let s=0;return this.inputNodes.reduce((a,o)=>{var i,u,l;const h=(l=(u=(i=this.signature)===null||i===void 0?void 0:i.inputs)===null||u===void 0?void 0:u[o])===null||l===void 0?void 0:l.resourceId;return h!=null?a[o]=this.resourceIdToCapturedInput[h]:a[o]=e[s++],a},{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}executeInitializerGraph(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.execute({},[]):this.initializer.execute({},Object.keys(this.initializerSignature.outputs))}async executeInitializerGraphAsync(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.executeAsync({},[]):this.initializer.executeAsync({},Object.keys(this.initializerSignature.outputs))}setResourceIdToCapturedInput(e){if(this.resourceIdToCapturedInput={},this.initializerSignature){const n=this.initializerSignature.outputs,r=Object.keys(n);for(let s=0;s<r.length;s++){const a=r[s],o=n[a];this.resourceIdToCapturedInput[o.resourceId]=e[s]}}}execute(e,n){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(this.executeInitializerGraph()),e=this.normalizeInputs(e),n=this.normalizeOutputs(n);const r=this.executor.execute(e,n);return r.length>1?r:r[0]}async executeAsync(e,n){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(await this.executeInitializerGraphAsync()),e=this.normalizeInputs(e),n=this.normalizeOutputs(n);const r=await this.executor.executeAsync(e,n);return r.length>1?r:r[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce((n,r)=>(n[r]=[e[r]],n),{})}dispose(){this.executor.dispose(),this.initializer&&(this.initializer.dispose(),this.resourceIdToCapturedInput&&de(this.resourceIdToCapturedInput)),this.resourceManager.dispose()}}async function MT(t,e={},n=ya){if(t==null)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");e==null&&(e={}),e.fromTFHub&&typeof t=="string"&&(t=qT(t));const r=new Sa(t,e,n);return await r.load(),r}function WT(t){if(t==null)throw new Error("modelUrl in loadGraphModelSync() cannot be null. Please provide model artifacts or an IOHandler that loads the model");let e;if(t instanceof Array){const[r,s]=t;if(!r)throw new Error("modelJSON must be the first element of the array");if(!s||!(s instanceof ArrayBuffer))throw new Error("An ArrayBuffer of weights must be the second element of the array");if(!("modelTopology"in r))throw new Error("Model JSON is missing 'modelTopology'");if(!("weightsManifest"in r))throw new Error("Model JSON is missing 'weightsManifest'");const a=Xn(r.weightsManifest),o=Ss(r,a,s);e=er(o)}else if("load"in t)e=t;else if("modelTopology"in t&&"weightSpecs"in t&&"weightData"in t)e=er(t);else throw new Error("Unknown model format");const n=new Sa(e);return n.load(),n}function qT(t){return t.endsWith("/")||(t=t+"/"),`${t}${jT}${VT}`}/** @license See the LICENSE file. */const UT="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const GT=Object.freeze(Object.defineProperty({__proto__:null,GraphModel:Sa,deregisterOp:yS,loadGraphModel:MT,loadGraphModelSync:WT,registerOp:gS,version_converter:UT},Symbol.toStringTag,{value:"Module"})),HT=is(GT),KT=is(mS);/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var XT=Xt.exports,no;function ZT(){return no||(no=1,(function(t,e){(function(n,r){r(e,HT,KT)})(XT,(function(n,r,s){const a={1:{name:"/m/01g317",id:1,displayName:"person"},2:{name:"/m/0199g",id:2,displayName:"bicycle"},3:{name:"/m/0k4j",id:3,displayName:"car"},4:{name:"/m/04_sv",id:4,displayName:"motorcycle"},5:{name:"/m/05czz6l",id:5,displayName:"airplane"},6:{name:"/m/01bjv",id:6,displayName:"bus"},7:{name:"/m/07jdr",id:7,displayName:"train"},8:{name:"/m/07r04",id:8,displayName:"truck"},9:{name:"/m/019jd",id:9,displayName:"boat"},10:{name:"/m/015qff",id:10,displayName:"traffic light"},11:{name:"/m/01pns0",id:11,displayName:"fire hydrant"},13:{name:"/m/02pv19",id:13,displayName:"stop sign"},14:{name:"/m/015qbp",id:14,displayName:"parking meter"},15:{name:"/m/0cvnqh",id:15,displayName:"bench"},16:{name:"/m/015p6",id:16,displayName:"bird"},17:{name:"/m/01yrx",id:17,displayName:"cat"},18:{name:"/m/0bt9lr",id:18,displayName:"dog"},19:{name:"/m/03k3r",id:19,displayName:"horse"},20:{name:"/m/07bgp",id:20,displayName:"sheep"},21:{name:"/m/01xq0k1",id:21,displayName:"cow"},22:{name:"/m/0bwd_0j",id:22,displayName:"elephant"},23:{name:"/m/01dws",id:23,displayName:"bear"},24:{name:"/m/0898b",id:24,displayName:"zebra"},25:{name:"/m/03bk1",id:25,displayName:"giraffe"},27:{name:"/m/01940j",id:27,displayName:"backpack"},28:{name:"/m/0hnnb",id:28,displayName:"umbrella"},31:{name:"/m/080hkjn",id:31,displayName:"handbag"},32:{name:"/m/01rkbr",id:32,displayName:"tie"},33:{name:"/m/01s55n",id:33,displayName:"suitcase"},34:{name:"/m/02wmf",id:34,displayName:"frisbee"},35:{name:"/m/071p9",id:35,displayName:"skis"},36:{name:"/m/06__v",id:36,displayName:"snowboard"},37:{name:"/m/018xm",id:37,displayName:"sports ball"},38:{name:"/m/02zt3",id:38,displayName:"kite"},39:{name:"/m/03g8mr",id:39,displayName:"baseball bat"},40:{name:"/m/03grzl",id:40,displayName:"baseball glove"},41:{name:"/m/06_fw",id:41,displayName:"skateboard"},42:{name:"/m/019w40",id:42,displayName:"surfboard"},43:{name:"/m/0dv9c",id:43,displayName:"tennis racket"},44:{name:"/m/04dr76w",id:44,displayName:"bottle"},46:{name:"/m/09tvcd",id:46,displayName:"wine glass"},47:{name:"/m/08gqpm",id:47,displayName:"cup"},48:{name:"/m/0dt3t",id:48,displayName:"fork"},49:{name:"/m/04ctx",id:49,displayName:"knife"},50:{name:"/m/0cmx8",id:50,displayName:"spoon"},51:{name:"/m/04kkgm",id:51,displayName:"bowl"},52:{name:"/m/09qck",id:52,displayName:"banana"},53:{name:"/m/014j1m",id:53,displayName:"apple"},54:{name:"/m/0l515",id:54,displayName:"sandwich"},55:{name:"/m/0cyhj_",id:55,displayName:"orange"},56:{name:"/m/0hkxq",id:56,displayName:"broccoli"},57:{name:"/m/0fj52s",id:57,displayName:"carrot"},58:{name:"/m/01b9xk",id:58,displayName:"hot dog"},59:{name:"/m/0663v",id:59,displayName:"pizza"},60:{name:"/m/0jy4k",id:60,displayName:"donut"},61:{name:"/m/0fszt",id:61,displayName:"cake"},62:{name:"/m/01mzpv",id:62,displayName:"chair"},63:{name:"/m/02crq1",id:63,displayName:"couch"},64:{name:"/m/03fp41",id:64,displayName:"potted plant"},65:{name:"/m/03ssj5",id:65,displayName:"bed"},67:{name:"/m/04bcr3",id:67,displayName:"dining table"},70:{name:"/m/09g1w",id:70,displayName:"toilet"},72:{name:"/m/07c52",id:72,displayName:"tv"},73:{name:"/m/01c648",id:73,displayName:"laptop"},74:{name:"/m/020lf",id:74,displayName:"mouse"},75:{name:"/m/0qjjc",id:75,displayName:"remote"},76:{name:"/m/01m2v",id:76,displayName:"keyboard"},77:{name:"/m/050k8",id:77,displayName:"cell phone"},78:{name:"/m/0fx9l",id:78,displayName:"microwave"},79:{name:"/m/029bxz",id:79,displayName:"oven"},80:{name:"/m/01k6s3",id:80,displayName:"toaster"},81:{name:"/m/0130jx",id:81,displayName:"sink"},82:{name:"/m/040b_t",id:82,displayName:"refrigerator"},84:{name:"/m/0bt_c3",id:84,displayName:"book"},85:{name:"/m/01x3z",id:85,displayName:"clock"},86:{name:"/m/02s195",id:86,displayName:"vase"},87:{name:"/m/01lsmm",id:87,displayName:"scissors"},88:{name:"/m/0kmg4",id:88,displayName:"teddy bear"},89:{name:"/m/03wvsk",id:89,displayName:"hair drier"},90:{name:"/m/012xff",id:90,displayName:"toothbrush"}};class o{constructor(u,l){this.modelPath=l||`https://storage.googleapis.com/tfjs-models/savedmodel/${this.getPrefix(u)}/model.json`}getPrefix(u){return u==="lite_mobilenet_v2"?`ssd${u}`:`ssd_${u}`}async load(){this.model=await r.loadGraphModel(this.modelPath);const u=s.zeros([1,300,300,3],"int32"),l=await this.model.executeAsync(u);await Promise.all(l.map((h=>h.data()))),l.map((h=>h.dispose())),u.dispose()}async infer(u,l,h){const c=s.tidy((()=>(u instanceof s.Tensor||(u=s.browser.fromPixels(u)),s.expandDims(u)))),f=c.shape[1],m=c.shape[2],b=await this.model.executeAsync(c),T=b[0].dataSync(),w=b[1].dataSync();c.dispose(),s.dispose(b);const[$,O]=this.calculateMaxScores(T,b[0].shape[1],b[0].shape[2]),v=s.getBackend();s.getBackend()==="webgl"&&s.setBackend("cpu");const _=s.tidy((()=>{const D=s.tensor2d(w,[b[1].shape[1],b[1].shape[3]]);return s.image.nonMaxSuppression(D,$,l,h,h)})),x=_.dataSync();return _.dispose(),v!==s.getBackend()&&s.setBackend(v),this.buildDetectedObjects(m,f,w,$,x,O)}buildDetectedObjects(u,l,h,c,f,m){const b=f.length,T=[];for(let w=0;w<b;w++){const $=[];for(let D=0;D<4;D++)$[D]=h[4*f[w]+D];const O=$[0]*l,v=$[1]*u,_=$[2]*l,x=$[3]*u;$[0]=v,$[1]=O,$[2]=x-v,$[3]=_-O,T.push({bbox:$,class:a[m[f[w]]+1].displayName,score:c[f[w]]})}return T}calculateMaxScores(u,l,h){const c=[],f=[];for(let m=0;m<l;m++){let b=Number.MIN_VALUE,T=-1;for(let w=0;w<h;w++)u[m*h+w]>b&&(b=u[m*h+w],T=w);c[m]=b,f[m]=T}return[c,f]}async detect(u,l=20,h=.5){return this.infer(u,l,h)}dispose(){this.model!=null&&this.model.dispose()}}n.ObjectDetection=o,n.load=async function(i={}){if(s==null)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this model.");const u=i.base||"lite_mobilenet_v2",l=i.modelUrl;if(["mobilenet_v1","mobilenet_v2","lite_mobilenet_v2"].indexOf(u)===-1)throw new Error(`ObjectDetection constructed with invalid base model ${u}. Valid names are 'mobilenet_v1', 'mobilenet_v2' and 'lite_mobilenet_v2'.`);const h=new o(u,l);return await h.load(),h},n.version="2.2.3",Object.defineProperty(n,"__esModule",{value:!0})}))})(Xt,Xt.exports)),Xt.exports}var Dp=ZT();const JT=ro(Dp),QT=so({__proto__:null,default:JT},[Dp]);export{QT as c};
