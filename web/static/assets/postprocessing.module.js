/**
 * postprocessing v6.34.3 build Sat Feb 10 2024
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2024 Raoul van Rüschen
 * @license Zlib
 */

// package.json
var version = "6.34.3";

// src/core/Disposable.js
var Disposable = class {
  /**
   * Frees internal resources.
   */
  dispose() {
  }
};

// src/core/EffectComposer.js
import {
  DepthStencilFormat,
  DepthTexture,
  LinearFilter as LinearFilter2,
  UnsignedByteType as UnsignedByteType11,
  UnsignedIntType,
  UnsignedInt248Type,
  Vector2 as Vector216,
  WebGLRenderTarget as WebGLRenderTarget13
} from "three";

// src/passes/AdaptiveLuminancePass.js
import { NearestFilter, WebGLRenderTarget as WebGLRenderTarget3 } from "three";

// src/materials/AdaptiveLuminanceMaterial.js
import { NoBlending, ShaderMaterial, Uniform } from "three";

// src/materials/glsl/adaptive-luminance.frag
var adaptive_luminance_default = "#include <packing>\n#define packFloatToRGBA(v) packDepthToRGBA(v)\n#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)\nuniform lowp sampler2D luminanceBuffer0;uniform lowp sampler2D luminanceBuffer1;uniform float minLuminance;uniform float deltaTime;uniform float tau;varying vec2 vUv;void main(){float l0=unpackRGBAToFloat(texture2D(luminanceBuffer0,vUv));\n#if __VERSION__ < 300\nfloat l1=texture2DLodEXT(luminanceBuffer1,vUv,MIP_LEVEL_1X1).r;\n#else\nfloat l1=textureLod(luminanceBuffer1,vUv,MIP_LEVEL_1X1).r;\n#endif\nl0=max(minLuminance,l0);l1=max(minLuminance,l1);float adaptedLum=l0+(l1-l0)*(1.0-exp(-deltaTime*tau));gl_FragColor=(adaptedLum==1.0)?vec4(1.0):packFloatToRGBA(adaptedLum);}";

// src/materials/glsl/common.vert
var common_default = "varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/AdaptiveLuminanceMaterial.js
var AdaptiveLuminanceMaterial = class extends ShaderMaterial {
  /**
   * Constructs a new adaptive luminance material.
   */
  constructor() {
    super({
      name: "AdaptiveLuminanceMaterial",
      defines: {
        MIP_LEVEL_1X1: "0.0"
      },
      uniforms: {
        luminanceBuffer0: new Uniform(null),
        luminanceBuffer1: new Uniform(null),
        minLuminance: new Uniform(0.01),
        deltaTime: new Uniform(0),
        tau: new Uniform(1)
      },
      extensions: {
        shaderTextureLOD: true
      },
      blending: NoBlending,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: adaptive_luminance_default,
      vertexShader: common_default
    });
  }
  /**
   * The primary luminance buffer that contains the downsampled average luminance.
   *
   * @type {Texture}
   */
  set luminanceBuffer0(value) {
    this.uniforms.luminanceBuffer0.value = value;
  }
  /**
   * Sets the primary luminance buffer that contains the downsampled average luminance.
   *
   * @deprecated Use luminanceBuffer0 instead.
   * @param {Texture} value - The buffer.
   */
  setLuminanceBuffer0(value) {
    this.uniforms.luminanceBuffer0.value = value;
  }
  /**
   * The secondary luminance buffer.
   *
   * @type {Texture}
   */
  set luminanceBuffer1(value) {
    this.uniforms.luminanceBuffer1.value = value;
  }
  /**
   * Sets the secondary luminance buffer.
   *
   * @deprecated Use luminanceBuffer1 instead.
   * @param {Texture} value - The buffer.
   */
  setLuminanceBuffer1(value) {
    this.uniforms.luminanceBuffer1.value = value;
  }
  /**
   * The 1x1 mipmap level.
   *
   * This level is used to identify the smallest mipmap of the primary luminance buffer.
   *
   * @type {Number}
   */
  set mipLevel1x1(value) {
    this.defines.MIP_LEVEL_1X1 = value.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Sets the 1x1 mipmap level.
   *
   * @deprecated Use mipLevel1x1 instead.
   * @param {Number} value - The level.
   */
  setMipLevel1x1(value) {
    this.mipLevel1x1 = value;
  }
  /**
   * The delta time.
   *
   * @type {Number}
   */
  set deltaTime(value) {
    this.uniforms.deltaTime.value = value;
  }
  /**
   * Sets the delta time.
   *
   * @deprecated Use deltaTime instead.
   * @param {Number} value - The delta time.
   */
  setDeltaTime(value) {
    this.uniforms.deltaTime.value = value;
  }
  /**
   * The lowest possible luminance value.
   *
   * @type {Number}
   */
  get minLuminance() {
    return this.uniforms.minLuminance.value;
  }
  set minLuminance(value) {
    this.uniforms.minLuminance.value = value;
  }
  /**
   * Returns the lowest possible luminance value.
   *
   * @deprecated Use minLuminance instead.
   * @return {Number} The minimum luminance.
   */
  getMinLuminance() {
    return this.uniforms.minLuminance.value;
  }
  /**
   * Sets the minimum luminance.
   *
   * @deprecated Use minLuminance instead.
   * @param {Number} value - The minimum luminance.
   */
  setMinLuminance(value) {
    this.uniforms.minLuminance.value = value;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   */
  get adaptationRate() {
    return this.uniforms.tau.value;
  }
  set adaptationRate(value) {
    this.uniforms.tau.value = value;
  }
  /**
   * Returns the luminance adaptation rate.
   *
   * @deprecated Use adaptationRate instead.
   * @return {Number} The adaptation rate.
   */
  getAdaptationRate() {
    return this.uniforms.tau.value;
  }
  /**
   * Sets the luminance adaptation rate.
   *
   * @deprecated Use adaptationRate instead.
   * @param {Number} value - The adaptation rate.
   */
  setAdaptationRate(value) {
    this.uniforms.tau.value = value;
  }
};

// src/materials/BokehMaterial.js
import { NoBlending as NoBlending2, ShaderMaterial as ShaderMaterial2, Uniform as Uniform2, Vector2 } from "three";

// src/materials/glsl/convolution.bokeh.frag
var convolution_bokeh_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#if PASS == 1\nuniform vec4 kernel64[32];\n#else\nuniform vec4 kernel16[8];\n#endif\nuniform lowp sampler2D cocBuffer;uniform vec2 texelSize;uniform float scale;varying vec2 vUv;void main(){\n#ifdef FOREGROUND\nvec2 cocNearFar=texture2D(cocBuffer,vUv).rg*scale;float coc=cocNearFar.x;\n#else\nfloat coc=texture2D(cocBuffer,vUv).g*scale;\n#endif\nif(coc==0.0){gl_FragColor=texture2D(inputBuffer,vUv);}else{\n#ifdef FOREGROUND\nvec2 step=texelSize*max(cocNearFar.x,cocNearFar.y);\n#else\nvec2 step=texelSize*coc;\n#endif\n#if PASS == 1\nvec4 acc=vec4(0.0);for(int i=0;i<32;++i){vec4 kernel=kernel64[i];vec2 uv=step*kernel.xy+vUv;acc+=texture2D(inputBuffer,uv);uv=step*kernel.zw+vUv;acc+=texture2D(inputBuffer,uv);}gl_FragColor=acc/64.0;\n#else\nvec4 maxValue=texture2D(inputBuffer,vUv);for(int i=0;i<8;++i){vec4 kernel=kernel16[i];vec2 uv=step*kernel.xy+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);uv=step*kernel.zw+vUv;maxValue=max(texture2D(inputBuffer,uv),maxValue);}gl_FragColor=maxValue;\n#endif\n}}";

// src/materials/BokehMaterial.js
var BokehMaterial = class extends ShaderMaterial2 {
  /**
   * Constructs a new bokeh material.
   *
   * @param {Boolean} [fill=false] - Enables or disables the bokeh highlight fill mode.
   * @param {Boolean} [foreground=false] - Determines whether this material will be applied to foreground colors.
   */
  constructor(fill = false, foreground = false) {
    super({
      name: "BokehMaterial",
      defines: {
        PASS: fill ? "2" : "1"
      },
      uniforms: {
        inputBuffer: new Uniform2(null),
        cocBuffer: new Uniform2(null),
        texelSize: new Uniform2(new Vector2()),
        kernel64: new Uniform2(null),
        kernel16: new Uniform2(null),
        scale: new Uniform2(1)
      },
      blending: NoBlending2,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_bokeh_default,
      vertexShader: common_default
    });
    if (foreground) {
      this.defines.FOREGROUND = "1";
    }
    this.generateKernel();
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The circle of confusion buffer.
   *
   * @type {Texture}
   */
  set cocBuffer(value) {
    this.uniforms.cocBuffer.value = value;
  }
  /**
   * Sets the circle of confusion buffer.
   *
   * @deprecated Use cocBuffer instead.
   * @param {Texture} value - The buffer.
   */
  setCoCBuffer(value) {
    this.uniforms.cocBuffer.value = value;
  }
  /**
   * The blur scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale(value) {
    return this.scale;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * Generates the blur kernel.
   *
   * @private
   */
  generateKernel() {
    const GOLDEN_ANGLE = 2.39996323;
    const points64 = new Float64Array(128);
    const points16 = new Float64Array(32);
    let i64 = 0, i16 = 0;
    for (let i = 0, sqrt80 = Math.sqrt(80); i < 80; ++i) {
      const theta = i * GOLDEN_ANGLE;
      const r = Math.sqrt(i) / sqrt80;
      const u = r * Math.cos(theta), v3 = r * Math.sin(theta);
      if (i % 5 === 0) {
        points16[i16++] = u;
        points16[i16++] = v3;
      } else {
        points64[i64++] = u;
        points64[i64++] = v3;
      }
    }
    this.uniforms.kernel64.value = points64;
    this.uniforms.kernel16.value = points16;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/BoxBlurMaterial.js
import { NoBlending as NoBlending3, PerspectiveCamera, ShaderMaterial as ShaderMaterial3, Uniform as Uniform3, Vector2 as Vector22 } from "three";

// src/utils/BackCompat.js
import { LinearEncoding, REVISION, sRGBEncoding } from "three";

// src/enums/BlendFunction.js
var BlendFunction = {
  SKIP: 9,
  SET: 30,
  ADD: 0,
  ALPHA: 1,
  AVERAGE: 2,
  COLOR: 3,
  COLOR_BURN: 4,
  COLOR_DODGE: 5,
  DARKEN: 6,
  DIFFERENCE: 7,
  DIVIDE: 8,
  DST: 9,
  EXCLUSION: 10,
  HARD_LIGHT: 11,
  HARD_MIX: 12,
  HUE: 13,
  INVERT: 14,
  INVERT_RGB: 15,
  LIGHTEN: 16,
  LINEAR_BURN: 17,
  LINEAR_DODGE: 18,
  LINEAR_LIGHT: 19,
  LUMINOSITY: 20,
  MULTIPLY: 21,
  NEGATION: 22,
  NORMAL: 23,
  OVERLAY: 24,
  PIN_LIGHT: 25,
  REFLECT: 26,
  SATURATION: 27,
  SCREEN: 28,
  SOFT_LIGHT: 29,
  SRC: 30,
  SUBTRACT: 31,
  VIVID_LIGHT: 32
};

// src/enums/ColorChannel.js
var ColorChannel = {
  RED: 0,
  GREEN: 1,
  BLUE: 2,
  ALPHA: 3
};

// src/enums/ColorSpace.js
var NoColorSpace = "";
var SRGBColorSpace = "srgb";
var LinearSRGBColorSpace = "srgb-linear";
var DisplayP3ColorSpace = "display-p3";

// src/enums/DepthCopyMode.js
var DepthCopyMode = {
  FULL: 0,
  SINGLE: 1
};

// src/enums/DepthTestStrategy.js
var DepthTestStrategy = {
  DEFAULT: 0,
  KEEP_MAX_DEPTH: 1,
  DISCARD_MAX_DEPTH: 2
};

// src/enums/EdgeDetectionMode.js
var EdgeDetectionMode = {
  DEPTH: 0,
  LUMA: 1,
  COLOR: 2
};

// src/enums/EffectAttribute.js
var EffectAttribute = {
  NONE: 0,
  DEPTH: 1,
  CONVOLUTION: 2
};

// src/enums/EffectShaderSection.js
var EffectShaderSection = {
  FRAGMENT_HEAD: "FRAGMENT_HEAD",
  FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
  FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
  VERTEX_HEAD: "VERTEX_HEAD",
  VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"
};

// src/enums/GlitchMode.js
var GlitchMode = {
  DISABLED: 0,
  SPORADIC: 1,
  CONSTANT_MILD: 2,
  CONSTANT_WILD: 3
};

// src/enums/KernelSize.js
var KernelSize = {
  VERY_SMALL: 0,
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  VERY_LARGE: 4,
  HUGE: 5
};

// src/enums/LUTOperation.js
var LUTOperation = {
  SCALE_UP: "lut.scaleup"
};

// src/enums/MaskFunction.js
var MaskFunction = {
  DISCARD: 0,
  MULTIPLY: 1,
  MULTIPLY_RGB_SET_ALPHA: 2,
  MULTIPLY_RGB: 3
};

// src/enums/PredicationMode.js
var PredicationMode = {
  DISABLED: 0,
  DEPTH: 1,
  CUSTOM: 2
};

// src/enums/SMAAPreset.js
var SMAAPreset = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  ULTRA: 3
};

// src/enums/ToneMappingMode.js
var ToneMappingMode = {
  REINHARD: 0,
  REINHARD2: 1,
  REINHARD2_ADAPTIVE: 2,
  UNCHARTED2: 3,
  OPTIMIZED_CINEON: 4,
  ACES_FILMIC: 5,
  AGX: 6
};

// src/enums/VignetteTechnique.js
var VignetteTechnique = {
  DEFAULT: 0,
  ESKIL: 1
};

// src/enums/WebGLExtension.js
var WebGLExtension = {
  DERIVATIVES: "derivatives",
  FRAG_DEPTH: "fragDepth",
  DRAW_BUFFERS: "drawBuffers",
  SHADER_TEXTURE_LOD: "shaderTextureLOD"
};

// src/utils/BackCompat.js
var revision = Number(REVISION.replace(/\D+/g, ""));
var useColorSpace = revision >= 152;
var encodingToColorSpace = /* @__PURE__ */ new Map([
  [LinearEncoding, LinearSRGBColorSpace],
  [sRGBEncoding, SRGBColorSpace]
]);
var colorSpaceToEncoding = /* @__PURE__ */ new Map([
  [LinearSRGBColorSpace, LinearEncoding],
  [SRGBColorSpace, sRGBEncoding]
]);
function getOutputColorSpace(renderer) {
  return renderer === null ? null : useColorSpace ? renderer.outputColorSpace : encodingToColorSpace.get(renderer.outputEncoding);
}
function setTextureColorSpace(texture, colorSpace) {
  if (texture === null) {
    return;
  }
  if (useColorSpace) {
    texture.colorSpace = colorSpace;
  } else {
    texture.encoding = colorSpaceToEncoding.get(colorSpace);
  }
}
function copyTextureColorSpace(src, dest) {
  if (src === null || dest === null) {
    return;
  }
  if (useColorSpace) {
    dest.colorSpace = src.colorSpace;
  } else {
    dest.encoding = src.encoding;
  }
}
function updateFragmentShader(fragmentShader) {
  if (revision < 154) {
    return fragmentShader.replace("colorspace_fragment", "encodings_fragment");
  }
  return fragmentShader;
}
function validateToneMappingMode(mode) {
  if (revision < 160 && mode === ToneMappingMode.AGX) {
    console.warn("AgX requires three r160 or higher, falling back to ACES filmic");
    mode = ToneMappingMode.ACES_FILMIC;
  }
  return mode;
}

// src/utils/orthographicDepthToViewZ.js
function orthographicDepthToViewZ(depth, near, far) {
  return depth * (near - far) - near;
}

// src/utils/viewZToOrthographicDepth.js
function viewZToOrthographicDepth(viewZ, near, far) {
  return Math.min(Math.max((viewZ + near) / (near - far), 0), 1);
}

// src/materials/glsl/convolution.box.frag
var convolution_box_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#ifdef BILATERAL\n#include <packing>\nuniform vec2 cameraNearFar;\n#ifdef NORMAL_DEPTH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D normalDepthBuffer;\n#else\nuniform mediump sampler2D normalDepthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){return texture2D(normalDepthBuffer,uv).a;}\n#else\n#if DEPTH_PACKING == 3201\nuniform lowp sampler2D depthBuffer;\n#elif defined(GL_FRAGMENT_PRECISION_HIGH)\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}\n#endif\nfloat getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#endif\n}\n#ifdef PERSPECTIVE_CAMERA\n#define linearDepth(v) viewZToOrthographicDepth(getViewZ(readDepth(v)), cameraNearFar.x, cameraNearFar.y)\n#else\n#define linearDepth(v) readDepth(v)\n#endif\n#endif\n#define getTexel(v) texture2D(inputBuffer, v)\n#if KERNEL_SIZE == 3\nvarying vec2 vUv00,vUv01,vUv02;varying vec2 vUv03,vUv04,vUv05;varying vec2 vUv06,vUv07,vUv08;\n#elif KERNEL_SIZE == 5 && MAX_VARYING_VECTORS >= 13\nvarying vec2 vUv00,vUv01,vUv02,vUv03,vUv04;varying vec2 vUv05,vUv06,vUv07,vUv08,vUv09;varying vec2 vUv10,vUv11,vUv12,vUv13,vUv14;varying vec2 vUv15,vUv16,vUv17,vUv18,vUv19;varying vec2 vUv20,vUv21,vUv22,vUv23,vUv24;\n#else\nuniform vec2 texelSize;uniform float scale;varying vec2 vUv;\n#endif\nvoid main(){\n#if KERNEL_SIZE == 3\nvec4 c[]=vec4[KERNEL_SIZE_SQ](getTexel(vUv00),getTexel(vUv01),getTexel(vUv02),getTexel(vUv03),getTexel(vUv04),getTexel(vUv05),getTexel(vUv06),getTexel(vUv07),getTexel(vUv08));\n#ifdef BILATERAL\nfloat z[]=float[KERNEL_SIZE_SQ](linearDepth(vUv00),linearDepth(vUv01),linearDepth(vUv02),linearDepth(vUv03),linearDepth(vUv04),linearDepth(vUv05),linearDepth(vUv06),linearDepth(vUv07),linearDepth(vUv08));\n#endif\n#elif KERNEL_SIZE == 5 && MAX_VARYING_VECTORS >= 13\nvec4 c[]=vec4[KERNEL_SIZE_SQ](getTexel(vUv00),getTexel(vUv01),getTexel(vUv02),getTexel(vUv03),getTexel(vUv04),getTexel(vUv05),getTexel(vUv06),getTexel(vUv07),getTexel(vUv08),getTexel(vUv09),getTexel(vUv10),getTexel(vUv11),getTexel(vUv12),getTexel(vUv13),getTexel(vUv14),getTexel(vUv15),getTexel(vUv16),getTexel(vUv17),getTexel(vUv18),getTexel(vUv19),getTexel(vUv20),getTexel(vUv21),getTexel(vUv22),getTexel(vUv23),getTexel(vUv24));\n#ifdef BILATERAL\nfloat z[]=float[KERNEL_SIZE_SQ](linearDepth(vUv00),linearDepth(vUv01),linearDepth(vUv02),linearDepth(vUv03),linearDepth(vUv04),linearDepth(vUv05),linearDepth(vUv06),linearDepth(vUv07),linearDepth(vUv08),linearDepth(vUv09),linearDepth(vUv10),linearDepth(vUv11),linearDepth(vUv12),linearDepth(vUv13),linearDepth(vUv14),linearDepth(vUv15),linearDepth(vUv16),linearDepth(vUv17),linearDepth(vUv18),linearDepth(vUv19),linearDepth(vUv20),linearDepth(vUv21),linearDepth(vUv22),linearDepth(vUv23),linearDepth(vUv24));\n#endif\n#endif\nvec4 result=vec4(0.0);\n#ifdef BILATERAL\nfloat w=0.0;\n#if KERNEL_SIZE == 3 || (KERNEL_SIZE == 5 && MAX_VARYING_VECTORS >= 13)\nfloat centerDepth=z[KERNEL_SIZE_SQ_HALF];for(int i=0;i<KERNEL_SIZE_SQ;++i){float d=step(abs(z[i]-centerDepth),DISTANCE_THRESHOLD);result+=c[i]*d;w+=d;}\n#else\nfloat centerDepth=linearDepth(vUv);vec2 s=texelSize*scale;for(int x=-KERNEL_SIZE_HALF;x<=KERNEL_SIZE_HALF;++x){for(int y=-KERNEL_SIZE_HALF;y<=KERNEL_SIZE_HALF;++y){vec2 coords=vUv+vec2(x,y)*s;vec4 c=getTexel(coords);float z=(x==0&&y==0)?centerDepth:linearDepth(coords);float d=step(abs(z-centerDepth),DISTANCE_THRESHOLD);result+=c*d;w+=d;}}\n#endif\ngl_FragColor=result/max(w,1.0);\n#else\n#if KERNEL_SIZE == 3 || (KERNEL_SIZE == 5 && MAX_VARYING_VECTORS >= 13)\nfor(int i=0;i<KERNEL_SIZE_SQ;++i){result+=c[i];}\n#else\nvec2 s=texelSize*scale;for(int x=-KERNEL_SIZE_HALF;x<=KERNEL_SIZE_HALF;++x){for(int y=-KERNEL_SIZE_HALF;y<=KERNEL_SIZE_HALF;++y){result+=getTexel(uv+vec2(x,y)*s);}}\n#endif\ngl_FragColor=result*INV_KERNEL_SIZE_SQ;\n#endif\n}";

// src/materials/glsl/convolution.box.vert
var convolution_box_default2 = "uniform vec2 texelSize;uniform float scale;\n#if KERNEL_SIZE == 3\nvarying vec2 vUv00,vUv01,vUv02;varying vec2 vUv03,vUv04,vUv05;varying vec2 vUv06,vUv07,vUv08;\n#elif KERNEL_SIZE == 5 && MAX_VARYING_VECTORS >= 13\nvarying vec2 vUv00,vUv01,vUv02,vUv03,vUv04;varying vec2 vUv05,vUv06,vUv07,vUv08,vUv09;varying vec2 vUv10,vUv11,vUv12,vUv13,vUv14;varying vec2 vUv15,vUv16,vUv17,vUv18,vUv19;varying vec2 vUv20,vUv21,vUv22,vUv23,vUv24;\n#else\nvarying vec2 vUv;\n#endif\nvoid main(){vec2 uv=position.xy*0.5+0.5;\n#if KERNEL_SIZE == 3\nvec2 s=texelSize*scale;vUv00=uv+s*vec2(-1.0,-1.0);vUv01=uv+s*vec2(0.0,-1.0);vUv02=uv+s*vec2(1.0,-1.0);vUv03=uv+s*vec2(-1.0,0.0);vUv04=uv;vUv05=uv+s*vec2(1.0,0.0);vUv06=uv+s*vec2(-1.0,1.0);vUv07=uv+s*vec2(0.0,1.0);vUv08=uv+s*vec2(1.0,1.0);\n#elif KERNEL_SIZE == 5\nvec2 s=texelSize*scale;vUv00=uv+s*vec2(-2.0,-2.0);vUv01=uv+s*vec2(-1.0,-2.0);vUv02=uv+s*vec2(0.0,-2.0);vUv03=uv+s*vec2(1.0,-2.0);vUv04=uv+s*vec2(2.0,-2.0);vUv05=uv+s*vec2(-2.0,-1.0);vUv06=uv+s*vec2(-1.0,-1.0);vUv07=uv+s*vec2(0.0,-1.0);vUv08=uv+s*vec2(1.0,-1.0);vUv09=uv+s*vec2(2.0,-1.0);vUv10=uv+s*vec2(-2.0,0.0);vUv11=uv+s*vec2(-1.0,0.0);vUv12=uv;vUv13=uv+s*vec2(1.0,0.0);vUv14=uv+s*vec2(2.0,0.0);vUv15=uv+s*vec2(-2.0,1.0);vUv16=uv+s*vec2(-1.0,1.0);vUv17=uv+s*vec2(0.0,1.0);vUv18=uv+s*vec2(1.0,1.0);vUv19=uv+s*vec2(2.0,1.0);vUv20=uv+s*vec2(-2.0,2.0);vUv21=uv+s*vec2(-1.0,2.0);vUv22=uv+s*vec2(0.0,2.0);vUv23=uv+s*vec2(1.0,2.0);vUv24=uv+s*vec2(2.0,2.0);\n#else\nvUv=uv;\n#endif\ngl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/BoxBlurMaterial.js
var BoxBlurMaterial = class extends ShaderMaterial3 {
  /**
   * Constructs a new box blur material.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.bilateral=false] - Enables or disables bilateral blurring.
   * @param {Number} [options.kernelSize=5] - The kernel size.
   */
  constructor({ bilateral = false, kernelSize = 5 } = {}) {
    super({
      name: "BoxBlurMaterial",
      defines: {
        DEPTH_PACKING: "0",
        DISTANCE_THRESHOLD: "0.1"
      },
      uniforms: {
        inputBuffer: new Uniform3(null),
        depthBuffer: new Uniform3(null),
        normalDepthBuffer: new Uniform3(null),
        texelSize: new Uniform3(new Vector22()),
        cameraNearFar: new Uniform3(new Vector22()),
        scale: new Uniform3(1)
      },
      blending: NoBlending3,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_box_default,
      vertexShader: convolution_box_default2
    });
    this.bilateral = bilateral;
    this.kernelSize = kernelSize;
    this.maxVaryingVectors = 8;
  }
  /**
   * The maximum amount of varying vectors.
   *
   * Should be synced with `renderer.capabilities.maxVaryings`. Default is 8.
   *
   * @type {Number}
   */
  set maxVaryingVectors(value) {
    this.defines.MAX_VARYING_VECTORS = value.toFixed(0);
  }
  /**
   * The kernel size.
   *
   * - Must be an odd number
   * - Kernel size 3 and 5 use optimized code paths
   * - Default is 5
   *
   * @type {Number}
   */
  get kernelSize() {
    return Number(this.defines.KERNEL_SIZE);
  }
  set kernelSize(value) {
    if (value % 2 === 0) {
      throw new Error("The kernel size must be an odd number");
    }
    this.defines.KERNEL_SIZE = value.toFixed(0);
    this.defines.KERNEL_SIZE_HALF = Math.floor(value / 2).toFixed(0);
    this.defines.KERNEL_SIZE_SQ = (value ** 2).toFixed(0);
    this.defines.KERNEL_SIZE_SQ_HALF = Math.floor(value ** 2 / 2).toFixed(0);
    this.defines.INV_KERNEL_SIZE_SQ = (1 / value ** 2).toFixed(6);
    this.needsUpdate = true;
  }
  /**
   * The blur scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * The current near plane setting.
   *
   * @type {Number}
   * @private
   */
  get near() {
    return this.uniforms.cameraNearFar.value.x;
  }
  /**
   * The current far plane setting.
   *
   * @type {Number}
   * @private
   */
  get far() {
    return this.uniforms.cameraNearFar.value.y;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * A combined normal-depth buffer. Overrides {@link depthBuffer} if set.
   *
   * @type {Texture}
   */
  set normalDepthBuffer(value) {
    this.uniforms.normalDepthBuffer.value = value;
    if (value !== null) {
      this.defines.NORMAL_DEPTH = "1";
    } else {
      delete this.defines.NORMAL_DEPTH;
    }
    this.needsUpdate = true;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Indicates whether bilateral filtering is enabled.
   *
   * @type {Boolean}
   */
  get bilateral() {
    return this.defines.BILATERAL !== void 0;
  }
  set bilateral(value) {
    if (value !== null) {
      this.defines.BILATERAL = "1";
    } else {
      delete this.defines.BILATERAL;
    }
    this.needsUpdate = true;
  }
  /**
   * The bilateral filter distance threshold in world units.
   *
   * @type {Number}
   */
  get worldDistanceThreshold() {
    return -orthographicDepthToViewZ(Number(this.defines.DISTANCE_THRESHOLD), this.near, this.far);
  }
  set worldDistanceThreshold(value) {
    const threshold = viewZToOrthographicDepth(-value, this.near, this.far);
    this.defines.DISTANCE_THRESHOLD = threshold.toFixed(12);
    this.needsUpdate = true;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
      if (camera instanceof PerspectiveCamera) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/CircleOfConfusionMaterial.js
import { BasicDepthPacking, NoBlending as NoBlending4, PerspectiveCamera as PerspectiveCamera2, ShaderMaterial as ShaderMaterial4, Uniform as Uniform4 } from "three";

// src/materials/glsl/circle-of-confusion.frag
var circle_of_confusion_default = "#include <common>\n#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform float focusDistance;uniform float focusRange;uniform float cameraNear;uniform float cameraFar;varying vec2 vUv;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nfloat depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nfloat depth=texture2D(depthBuffer,uv).r;\n#endif\n#ifdef LOG_DEPTH\nfloat d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;\n#endif\nreturn depth;}void main(){float depth=readDepth(vUv);\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);\n#else\nfloat linearDepth=depth;\n#endif\nfloat signedDistance=linearDepth-focusDistance;float magnitude=smoothstep(0.0,focusRange,abs(signedDistance));gl_FragColor.rg=magnitude*vec2(step(signedDistance,0.0),step(0.0,signedDistance));}";

// src/materials/CircleOfConfusionMaterial.js
var CircleOfConfusionMaterial = class extends ShaderMaterial4 {
  /**
   * Constructs a new CoC material.
   *
   * @param {Camera} camera - A camera.
   */
  constructor(camera) {
    super({
      name: "CircleOfConfusionMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform4(null),
        focusDistance: new Uniform4(0),
        focusRange: new Uniform4(0),
        cameraNear: new Uniform4(0.3),
        cameraFar: new Uniform4(1e3)
      },
      blending: NoBlending4,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: circle_of_confusion_default,
      vertexShader: common_default
    });
    this.uniforms.focalLength = this.uniforms.focusRange;
    this.copyCameraSettings(camera);
  }
  /**
   * The current near plane setting.
   *
   * @type {Number}
   * @private
   */
  get near() {
    return this.uniforms.cameraNear.value;
  }
  /**
   * The current far plane setting.
   *
   * @type {Number}
   * @private
   */
  get far() {
    return this.uniforms.cameraFar.value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * The focus distance. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get focusDistance() {
    return this.uniforms.focusDistance.value;
  }
  set focusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * The focus distance in world units.
   *
   * @type {Number}
   */
  get worldFocusDistance() {
    return -orthographicDepthToViewZ(this.focusDistance, this.near, this.far);
  }
  set worldFocusDistance(value) {
    this.focusDistance = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Returns the focus distance.
   *
   * @deprecated Use focusDistance instead.
   * @return {Number} The focus distance.
   */
  getFocusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * Sets the focus distance.
   *
   * @deprecated Use focusDistance instead.
   * @param {Number} value - The focus distance.
   */
  setFocusDistance(value) {
    this.uniforms.focusDistance.value = value;
  }
  /**
   * The focal length.
   *
   * @deprecated Renamed to focusRange.
   * @type {Number}
   */
  get focalLength() {
    return this.focusRange;
  }
  set focalLength(value) {
    this.focusRange = value;
  }
  /**
   * The focus range. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get focusRange() {
    return this.uniforms.focusRange.value;
  }
  set focusRange(value) {
    this.uniforms.focusRange.value = value;
  }
  /**
   * The focus range in world units.
   *
   * @type {Number}
   */
  get worldFocusRange() {
    return -orthographicDepthToViewZ(this.focusRange, this.near, this.far);
  }
  set worldFocusRange(value) {
    this.focusRange = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Returns the focal length.
   *
   * @deprecated Use focusRange instead.
   * @return {Number} The focal length.
   */
  getFocalLength(value) {
    return this.focusRange;
  }
  /**
   * Sets the focal length.
   *
   * @deprecated Use focusRange instead.
   * @param {Number} value - The focal length.
   */
  setFocalLength(value) {
    this.focusRange = value;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera2) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};

// src/materials/KawaseBlurMaterial.js
import { NoBlending as NoBlending5, ShaderMaterial as ShaderMaterial5, Uniform as Uniform5, Vector4 } from "three";

// src/materials/glsl/convolution.kawase.frag
var convolution_kawase_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nvarying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;\n#include <colorspace_fragment>\n}";

// src/materials/glsl/convolution.kawase.vert
var convolution_kawase_default2 = "uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/KawaseBlurMaterial.js
var kernelPresets = [
  new Float32Array([0, 0]),
  new Float32Array([0, 1, 1]),
  new Float32Array([0, 1, 1, 2]),
  new Float32Array([0, 1, 2, 2, 3]),
  new Float32Array([0, 1, 2, 3, 4, 4, 5]),
  new Float32Array([0, 1, 2, 3, 4, 5, 7, 8, 9, 10])
];
var KawaseBlurMaterial = class extends ShaderMaterial5 {
  /**
   * Constructs a new convolution material.
   *
   * TODO Remove texelSize param.
   * @param {Vector4} [texelSize] - Deprecated.
   */
  constructor(texelSize = new Vector4()) {
    super({
      name: "KawaseBlurMaterial",
      uniforms: {
        inputBuffer: new Uniform5(null),
        texelSize: new Uniform5(new Vector4()),
        scale: new Uniform5(1),
        kernel: new Uniform5(0)
      },
      blending: NoBlending5,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_kawase_default,
      vertexShader: convolution_kawase_default2
    });
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
    this.setTexelSize(texelSize.x, texelSize.y);
    this.kernelSize = KernelSize.MEDIUM;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.inputBuffer = value;
  }
  /**
   * The kernel sequence for the current kernel size.
   *
   * @type {Float32Array}
   */
  get kernelSequence() {
    return kernelPresets[this.kernelSize];
  }
  /**
   * The blur scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.uniforms.scale.value;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} value - The scale.
   */
  setScale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Returns the kernel.
   *
   * @return {Float32Array} The kernel.
   * @deprecated Implementation detail, removed with no replacement.
   */
  getKernel() {
    return null;
  }
  /**
   * The current kernel.
   *
   * @type {Number}
   */
  get kernel() {
    return this.uniforms.kernel.value;
  }
  set kernel(value) {
    this.uniforms.kernel.value = value;
  }
  /**
   * Sets the current kernel.
   *
   * @deprecated Use kernel instead.
   * @param {Number} value - The kernel.
   */
  setKernel(value) {
    this.kernel = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const x = 1 / width, y = 1 / height;
    this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);
  }
};

// src/materials/CopyMaterial.js
import { NoBlending as NoBlending6, ShaderMaterial as ShaderMaterial6, Uniform as Uniform6 } from "three";

// src/materials/glsl/copy.frag
var copy_default = "#include <common>\n#include <dithering_pars_fragment>\n#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nuniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;\n#include <colorspace_fragment>\n#include <dithering_fragment>\n}";

// src/materials/CopyMaterial.js
var CopyMaterial = class extends ShaderMaterial6 {
  /**
   * Constructs a new copy material.
   */
  constructor() {
    super({
      name: "CopyMaterial",
      uniforms: {
        inputBuffer: new Uniform6(null),
        opacity: new Uniform6(1)
      },
      blending: NoBlending6,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: copy_default,
      vertexShader: common_default
    });
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Number} value - The buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Returns the opacity.
   *
   * @deprecated Use opacity instead.
   * @return {Number} The opacity.
   */
  getOpacity(value) {
    return this.uniforms.opacity.value;
  }
  /**
   * Sets the opacity.
   *
   * @deprecated Use opacity instead.
   * @param {Number} value - The opacity.
   */
  setOpacity(value) {
    this.uniforms.opacity.value = value;
  }
};

// src/materials/DepthComparisonMaterial.js
import { NoBlending as NoBlending7, PerspectiveCamera as PerspectiveCamera3, RGBADepthPacking, ShaderMaterial as ShaderMaterial7, Uniform as Uniform7 } from "three";

// src/materials/glsl/depth-comparison.frag
var depth_comparison_default = "#include <packing>\n#include <clipping_planes_pars_fragment>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform float cameraNear;uniform float cameraFar;centroid varying float vViewZ;centroid varying vec4 vProjTexCoord;void main(){\n#include <clipping_planes_fragment>\nvec2 projTexCoord=(vProjTexCoord.xy/vProjTexCoord.w)*0.5+0.5;projTexCoord=clamp(projTexCoord,0.002,0.998);\n#if DEPTH_PACKING == 3201\nfloat fragCoordZ=unpackRGBAToDepth(texture2D(depthBuffer,projTexCoord));\n#else\nfloat fragCoordZ=texture2D(depthBuffer,projTexCoord).r;\n#endif\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#else\nfloat viewZ=orthographicDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#endif\nfloat depthTest=(-vViewZ>-viewZ)?1.0:0.0;gl_FragColor.rg=vec2(0.0,depthTest);}";

// src/materials/glsl/depth-comparison.vert
var depth_comparison_default2 = "#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying float vViewZ;varying vec4 vProjTexCoord;void main(){\n#include <skinbase_vertex>\n#include <begin_vertex>\n#include <morphtarget_vertex>\n#include <skinning_vertex>\n#include <project_vertex>\nvViewZ=mvPosition.z;vProjTexCoord=gl_Position;\n#include <clipping_planes_vertex>\n}";

// src/materials/DepthComparisonMaterial.js
var DepthComparisonMaterial = class extends ShaderMaterial7 {
  /**
   * Constructs a new depth comparison material.
   *
   * @param {Texture} [depthTexture=null] - A depth texture.
   * @param {PerspectiveCamera} [camera] - A camera.
   */
  constructor(depthTexture = null, camera) {
    super({
      name: "DepthComparisonMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform7(null),
        cameraNear: new Uniform7(0.3),
        cameraFar: new Uniform7(1e3)
      },
      blending: NoBlending7,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_comparison_default,
      vertexShader: depth_comparison_default2
    });
    this.depthBuffer = depthTexture;
    this.depthPacking = RGBADepthPacking;
    this.copyCameraSettings(camera);
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=RGBADepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = RGBADepthPacking) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera3) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};

// src/materials/DepthCopyMaterial.js
import { BasicDepthPacking as BasicDepthPacking2, NoBlending as NoBlending8, ShaderMaterial as ShaderMaterial8, Uniform as Uniform8, Vector2 as Vector23 } from "three";

// src/materials/glsl/depth-copy.frag
var depth_copy_default = "#include <packing>\nvarying vec2 vUv;\n#ifdef NORMAL_DEPTH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D normalDepthBuffer;\n#else\nuniform mediump sampler2D normalDepthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){return texture2D(normalDepthBuffer,uv).a;}\n#else\n#if INPUT_DEPTH_PACKING == 3201\nuniform lowp sampler2D depthBuffer;\n#elif defined(GL_FRAGMENT_PRECISION_HIGH)\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if INPUT_DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}\n#endif\nvoid main(){\n#if INPUT_DEPTH_PACKING == OUTPUT_DEPTH_PACKING\ngl_FragColor=texture2D(depthBuffer,vUv);\n#else\nfloat depth=readDepth(vUv);\n#if OUTPUT_DEPTH_PACKING == 3201\ngl_FragColor=(depth==1.0)?vec4(1.0):packDepthToRGBA(depth);\n#else\ngl_FragColor=vec4(vec3(depth),1.0);\n#endif\n#endif\n}";

// src/materials/glsl/depth-copy.vert
var depth_copy_default2 = "varying vec2 vUv;\n#if DEPTH_COPY_MODE == 1\nuniform vec2 texelPosition;\n#endif\nvoid main(){\n#if DEPTH_COPY_MODE == 1\nvUv=texelPosition;\n#else\nvUv=position.xy*0.5+0.5;\n#endif\ngl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/DepthCopyMaterial.js
var DepthCopyMaterial = class extends ShaderMaterial8 {
  /**
   * Constructs a new depth copy material.
   */
  constructor() {
    super({
      name: "DepthCopyMaterial",
      defines: {
        INPUT_DEPTH_PACKING: "0",
        OUTPUT_DEPTH_PACKING: "0",
        DEPTH_COPY_MODE: "0"
      },
      uniforms: {
        depthBuffer: new Uniform8(null),
        texelPosition: new Uniform8(new Vector23())
      },
      blending: NoBlending8,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_copy_default,
      vertexShader: depth_copy_default2
    });
    this.depthCopyMode = DepthCopyMode.FULL;
  }
  /**
   * The input depth buffer.
   *
   * @type {Texture}
   */
  get depthBuffer() {
    return this.uniforms.depthBuffer.value;
  }
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The input depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set inputDepthPacking(value) {
    this.defines.INPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * The output depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  get outputDepthPacking() {
    return Number(this.defines.OUTPUT_DEPTH_PACKING);
  }
  set outputDepthPacking(value) {
    this.defines.OUTPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the input depth buffer.
   *
   * @deprecated Use depthBuffer and inputDepthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking2) {
    this.depthBuffer = buffer;
    this.inputDepthPacking = depthPacking;
  }
  /**
   * Returns the current input depth packing strategy.
   *
   * @deprecated
   * @return {DepthPackingStrategies} The input depth packing strategy.
   */
  getInputDepthPacking() {
    return Number(this.defines.INPUT_DEPTH_PACKING);
  }
  /**
   * Sets the input depth packing strategy.
   *
   * @deprecated Use inputDepthPacking instead.
   * @param {DepthPackingStrategies} value - The new input depth packing strategy.
   */
  setInputDepthPacking(value) {
    this.defines.INPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the current output depth packing strategy.
   *
   * @deprecated Use outputDepthPacking instead.
   * @return {DepthPackingStrategies} The output depth packing strategy.
   */
  getOutputDepthPacking() {
    return Number(this.defines.OUTPUT_DEPTH_PACKING);
  }
  /**
   * Sets the output depth packing strategy.
   *
   * @deprecated Use outputDepthPacking instead.
   * @param {DepthPackingStrategies} value - The new output depth packing strategy.
   */
  setOutputDepthPacking(value) {
    this.defines.OUTPUT_DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * The screen space position used for single-texel copy operations.
   *
   * @type {Vector2}
   */
  get texelPosition() {
    return this.uniforms.texelPosition.value;
  }
  /**
   * Returns the screen space position used for single-texel copy operations.
   *
   * @deprecated Use texelPosition instead.
   * @return {Vector2} The position.
   */
  getTexelPosition() {
    return this.uniforms.texelPosition.value;
  }
  /**
   * Sets the screen space position used for single-texel copy operations.
   *
   * @deprecated
   * @param {Vector2} value - The position.
   */
  setTexelPosition(value) {
    this.uniforms.texelPosition.value = value;
  }
  /**
   * The depth copy mode.
   *
   * @type {DepthCopyMode}
   */
  get mode() {
    return this.depthCopyMode;
  }
  set mode(value) {
    this.depthCopyMode = value;
    this.defines.DEPTH_COPY_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the depth copy mode.
   *
   * @deprecated Use mode instead.
   * @return {DepthCopyMode} The depth copy mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the depth copy mode.
   *
   * @deprecated Use mode instead.
   * @param {DepthCopyMode} value - The new mode.
   */
  setMode(value) {
    this.mode = value;
  }
};

// src/materials/DepthDownsamplingMaterial.js
import { BasicDepthPacking as BasicDepthPacking3, NoBlending as NoBlending9, ShaderMaterial as ShaderMaterial9, Uniform as Uniform9, Vector2 as Vector24 } from "three";

// src/materials/glsl/depth-downsampling.frag
var depth_downsampling_default = "#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\n#ifdef DOWNSAMPLE_NORMALS\nuniform lowp sampler2D normalBuffer;\n#endif\nvarying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);\n#ifdef DOWNSAMPLE_NORMALS\nvec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;\n#else\nvec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);\n#endif\ngl_FragColor=vec4(n[index],d[index]);}";

// src/materials/glsl/depth-downsampling.vert
var depth_downsampling_default2 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/DepthDownsamplingMaterial.js
var DepthDownsamplingMaterial = class extends ShaderMaterial9 {
  /**
   * Constructs a new depth downsampling material.
   */
  constructor() {
    super({
      name: "DepthDownsamplingMaterial",
      defines: {
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform9(null),
        normalBuffer: new Uniform9(null),
        texelSize: new Uniform9(new Vector24())
      },
      blending: NoBlending9,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_downsampling_default,
      vertexShader: depth_downsampling_default2
    });
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking3) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * The normal buffer.
   *
   * @type {Texture}
   */
  set normalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
    if (value !== null) {
      this.defines.DOWNSAMPLE_NORMALS = "1";
    } else {
      delete this.defines.DOWNSAMPLE_NORMALS;
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the normal buffer.
   *
   * @deprecated Use normalBuffer instead.
   * @param {Texture} value - The normal buffer.
   */
  setNormalBuffer(value) {
    this.normalBuffer = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/DepthMaskMaterial.js
import {
  AlwaysDepth,
  BasicDepthPacking as BasicDepthPacking4,
  EqualDepth,
  GreaterDepth,
  GreaterEqualDepth,
  LessDepth,
  LessEqualDepth,
  NeverDepth,
  NoBlending as NoBlending10,
  NotEqualDepth,
  PerspectiveCamera as PerspectiveCamera4,
  ShaderMaterial as ShaderMaterial10,
  Uniform as Uniform10,
  Vector2 as Vector25
} from "three";

// src/materials/glsl/depth-mask.frag
var depth_mask_default = "#include <common>\n#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer0;uniform highp sampler2D depthBuffer1;\n#else\nuniform mediump sampler2D depthBuffer0;uniform mediump sampler2D depthBuffer1;\n#endif\nuniform sampler2D inputBuffer;uniform vec2 cameraNearFar;float getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#endif\n}varying vec2 vUv;void main(){vec2 depth;\n#if DEPTH_PACKING_0 == 3201\ndepth.x=unpackRGBAToDepth(texture2D(depthBuffer0,vUv));\n#else\ndepth.x=texture2D(depthBuffer0,vUv).r;\n#ifdef LOG_DEPTH\nfloat d=pow(2.0,depth.x*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.x=a+b/d;\n#endif\n#endif\n#if DEPTH_PACKING_1 == 3201\ndepth.y=unpackRGBAToDepth(texture2D(depthBuffer1,vUv));\n#else\ndepth.y=texture2D(depthBuffer1,vUv).r;\n#ifdef LOG_DEPTH\nfloat d=pow(2.0,depth.y*log2(cameraNearFar.y+1.0))-1.0;float a=cameraNearFar.y/(cameraNearFar.y-cameraNearFar.x);float b=cameraNearFar.y*cameraNearFar.x/(cameraNearFar.x-cameraNearFar.y);depth.y=a+b/d;\n#endif\n#endif\nbool isMaxDepth=(depth.x==1.0);\n#ifdef PERSPECTIVE_CAMERA\ndepth.x=viewZToOrthographicDepth(getViewZ(depth.x),cameraNearFar.x,cameraNearFar.y);depth.y=viewZToOrthographicDepth(getViewZ(depth.y),cameraNearFar.x,cameraNearFar.y);\n#endif\n#if DEPTH_TEST_STRATEGY == 0\nbool keep=depthTest(depth.x,depth.y);\n#elif DEPTH_TEST_STRATEGY == 1\nbool keep=isMaxDepth||depthTest(depth.x,depth.y);\n#else\nbool keep=!isMaxDepth&&depthTest(depth.x,depth.y);\n#endif\nif(keep){gl_FragColor=texture2D(inputBuffer,vUv);}else{discard;}}";

// src/materials/DepthMaskMaterial.js
var DepthMaskMaterial = class extends ShaderMaterial10 {
  /**
   * Constructs a new depth mask material.
   */
  constructor() {
    super({
      name: "DepthMaskMaterial",
      defines: {
        DEPTH_EPSILON: "0.0001",
        DEPTH_PACKING_0: "0",
        DEPTH_PACKING_1: "0",
        DEPTH_TEST_STRATEGY: DepthTestStrategy.KEEP_MAX_DEPTH
      },
      uniforms: {
        inputBuffer: new Uniform10(null),
        depthBuffer0: new Uniform10(null),
        depthBuffer1: new Uniform10(null),
        cameraNearFar: new Uniform10(new Vector25(1, 1))
      },
      blending: NoBlending10,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: depth_mask_default,
      vertexShader: common_default
    });
    this.depthMode = LessDepth;
  }
  /**
   * The primary depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer0(value) {
    this.uniforms.depthBuffer0.value = value;
  }
  /**
   * The primary depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking0(value) {
    this.defines.DEPTH_PACKING_0 = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the base depth buffer.
   *
   * @deprecated Use depthBuffer0 and depthPacking0 instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer0(buffer, depthPacking = BasicDepthPacking4) {
    this.depthBuffer0 = buffer;
    this.depthPacking0 = depthPacking;
  }
  /**
   * The secondary depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer1(value) {
    this.uniforms.depthBuffer1.value = value;
  }
  /**
   * The secondary depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking1(value) {
    this.defines.DEPTH_PACKING_1 = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer that will be compared with the base depth buffer.
   *
   * @deprecated Use depthBuffer1 and depthPacking1 instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer1(buffer, depthPacking = BasicDepthPacking4) {
    this.depthBuffer1 = buffer;
    this.depthPacking1 = depthPacking;
  }
  /**
   * The strategy for handling maximum depth.
   *
   * @type {DepthTestStrategy}
   */
  get maxDepthStrategy() {
    return Number(this.defines.DEPTH_TEST_STRATEGY);
  }
  set maxDepthStrategy(value) {
    this.defines.DEPTH_TEST_STRATEGY = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Indicates whether maximum depth values should be preserved.
   *
   * @type {Boolean}
   * @deprecated Use maxDepthStrategy instead.
   */
  get keepFar() {
    return this.maxDepthStrategy;
  }
  set keepFar(value) {
    this.maxDepthStrategy = value ? DepthTestStrategy.KEEP_MAX_DEPTH : DepthTestStrategy.DISCARD_MAX_DEPTH;
  }
  /**
   * Returns the strategy for dealing with maximum depth values.
   *
   * @deprecated Use maxDepthStrategy instead.
   * @return {DepthTestStrategy} The strategy.
   */
  getMaxDepthStrategy() {
    return this.maxDepthStrategy;
  }
  /**
   * Sets the strategy for dealing with maximum depth values.
   *
   * @deprecated Use maxDepthStrategy instead.
   * @param {DepthTestStrategy} value - The strategy.
   */
  setMaxDepthStrategy(value) {
    this.maxDepthStrategy = value;
  }
  /**
   * A small error threshold that is used for `EqualDepth` and `NotEqualDepth` tests. Default is `1e-4`.
   *
   * @type {Number}
   */
  get epsilon() {
    return Number(this.defines.DEPTH_EPSILON);
  }
  set epsilon(value) {
    this.defines.DEPTH_EPSILON = value.toFixed(16);
    this.needsUpdate = true;
  }
  /**
   * Returns the current error threshold for depth comparisons.
   *
   * @deprecated Use epsilon instead.
   * @return {Number} The error threshold.
   */
  getEpsilon() {
    return this.epsilon;
  }
  /**
   * Sets the depth comparison error threshold.
   *
   * @deprecated Use epsilon instead.
   * @param {Number} value - The new error threshold.
   */
  setEpsilon(value) {
    this.epsilon = value;
  }
  /**
   * The depth mode.
   *
   * @see https://threejs.org/docs/#api/en/constants/Materials
   * @type {DepthModes}
   */
  get depthMode() {
    return Number(this.defines.DEPTH_MODE);
  }
  set depthMode(value) {
    let depthTest;
    switch (value) {
      case NeverDepth:
        depthTest = "false";
        break;
      case AlwaysDepth:
        depthTest = "true";
        break;
      case EqualDepth:
        depthTest = "abs(d1 - d0) <= DEPTH_EPSILON";
        break;
      case NotEqualDepth:
        depthTest = "abs(d1 - d0) > DEPTH_EPSILON";
        break;
      case LessDepth:
        depthTest = "d0 > d1";
        break;
      case LessEqualDepth:
        depthTest = "d0 >= d1";
        break;
      case GreaterEqualDepth:
        depthTest = "d0 <= d1";
        break;
      case GreaterDepth:
      default:
        depthTest = "d0 < d1";
        break;
    }
    this.defines.DEPTH_MODE = value.toFixed(0);
    this.defines["depthTest(d0, d1)"] = depthTest;
    this.needsUpdate = true;
  }
  /**
   * Returns the current depth mode.
   *
   * @deprecated Use depthMode instead.
   * @return {DepthModes} The depth mode. Default is `LessDepth`.
   */
  getDepthMode() {
    return this.depthMode;
  }
  /**
   * Sets the depth mode.
   *
   * @deprecated Use depthMode instead.
   * @param {DepthModes} mode - The depth mode.
   */
  setDepthMode(mode) {
    this.depthMode = mode;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
      if (camera instanceof PerspectiveCamera4) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
};

// src/materials/DownsamplingMaterial.js
import { NoBlending as NoBlending11, ShaderMaterial as ShaderMaterial11, Uniform as Uniform11, Vector2 as Vector26 } from "three";

// src/materials/glsl/convolution.downsampling.frag
var convolution_downsampling_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#define WEIGHT_INNER 0.125\n#define WEIGHT_OUTER 0.0555555\nvarying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;\n#include <colorspace_fragment>\n}";

// src/materials/glsl/convolution.downsampling.vert
var convolution_downsampling_default2 = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/DownsamplingMaterial.js
var DownsamplingMaterial = class extends ShaderMaterial11 {
  /**
   * Constructs a new downsampling material.
   */
  constructor() {
    super({
      name: "DownsamplingMaterial",
      uniforms: {
        inputBuffer: new Uniform11(null),
        texelSize: new Uniform11(new Vector26())
      },
      blending: NoBlending11,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_downsampling_default,
      vertexShader: convolution_downsampling_default2
    });
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/EdgeDetectionMaterial.js
import { BasicDepthPacking as BasicDepthPacking5, NoBlending as NoBlending12, REVISION as REVISION2, ShaderMaterial as ShaderMaterial12, Uniform as Uniform12, Vector2 as Vector27 } from "three";

// src/materials/glsl/edge-detection.frag
var edge_detection_default = "varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\n#if EDGE_DETECTION_MODE == 1\n#include <common>\n#endif\n#if EDGE_DETECTION_MODE == 0 || PREDICATION_MODE == 1\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}vec3 gatherNeighbors(){float p=readDepth(vUv);float pLeft=readDepth(vUv0);float pTop=readDepth(vUv1);return vec3(p,pLeft,pTop);}\n#elif PREDICATION_MODE == 2\nuniform sampler2D predicationBuffer;vec3 gatherNeighbors(){float p=texture2D(predicationBuffer,vUv).r;float pLeft=texture2D(predicationBuffer,vUv0).r;float pTop=texture2D(predicationBuffer,vUv1).r;return vec3(p,pLeft,pTop);}\n#endif\n#if PREDICATION_MODE != 0\nvec2 calculatePredicatedThreshold(){vec3 neighbours=gatherNeighbors();vec2 delta=abs(neighbours.xx-neighbours.yz);vec2 edges=step(PREDICATION_THRESHOLD,delta);return PREDICATION_SCALE*EDGE_THRESHOLD*(1.0-PREDICATION_STRENGTH*edges);}\n#endif\n#if EDGE_DETECTION_MODE != 0\nuniform sampler2D inputBuffer;\n#endif\nvoid main(){\n#if EDGE_DETECTION_MODE == 0\nconst vec2 threshold=vec2(DEPTH_THRESHOLD);\n#elif PREDICATION_MODE != 0\nvec2 threshold=calculatePredicatedThreshold();\n#else\nconst vec2 threshold=vec2(EDGE_THRESHOLD);\n#endif\n#if EDGE_DETECTION_MODE == 0\nvec3 neighbors=gatherNeighbors();vec2 delta=abs(neighbors.xx-vec2(neighbors.y,neighbors.z));vec2 edges=step(threshold,delta);if(dot(edges,vec2(1.0))==0.0){discard;}gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 1\nfloat l=luminance(texture2D(inputBuffer,vUv).rgb);float lLeft=luminance(texture2D(inputBuffer,vUv0).rgb);float lTop=luminance(texture2D(inputBuffer,vUv1).rgb);vec4 delta;delta.xy=abs(l-vec2(lLeft,lTop));vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}float lRight=luminance(texture2D(inputBuffer,vUv2).rgb);float lBottom=luminance(texture2D(inputBuffer,vUv3).rgb);delta.zw=abs(l-vec2(lRight,lBottom));vec2 maxDelta=max(delta.xy,delta.zw);float lLeftLeft=luminance(texture2D(inputBuffer,vUv4).rgb);float lTopTop=luminance(texture2D(inputBuffer,vUv5).rgb);delta.zw=abs(vec2(lLeft,lTop)-vec2(lLeftLeft,lTopTop));maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges.xy*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 2\nvec4 delta;vec3 c=texture2D(inputBuffer,vUv).rgb;vec3 cLeft=texture2D(inputBuffer,vUv0).rgb;vec3 t=abs(c-cLeft);delta.x=max(max(t.r,t.g),t.b);vec3 cTop=texture2D(inputBuffer,vUv1).rgb;t=abs(c-cTop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}vec3 cRight=texture2D(inputBuffer,vUv2).rgb;t=abs(c-cRight);delta.z=max(max(t.r,t.g),t.b);vec3 cBottom=texture2D(inputBuffer,vUv3).rgb;t=abs(c-cBottom);delta.w=max(max(t.r,t.g),t.b);vec2 maxDelta=max(delta.xy,delta.zw);vec3 cLeftLeft=texture2D(inputBuffer,vUv4).rgb;t=abs(c-cLeftLeft);delta.z=max(max(t.r,t.g),t.b);vec3 cTopTop=texture2D(inputBuffer,vUv5).rgb;t=abs(c-cTopTop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#endif\n}";

// src/materials/glsl/edge-detection.vert
var edge_detection_default2 = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\nvoid main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,0.0);vUv1=vUv+texelSize*vec2(0.0,-1.0);\n#if EDGE_DETECTION_MODE != 0\nvUv2=vUv+texelSize*vec2(1.0,0.0);vUv3=vUv+texelSize*vec2(0.0,1.0);vUv4=vUv+texelSize*vec2(-2.0,0.0);vUv5=vUv+texelSize*vec2(0.0,-2.0);\n#endif\ngl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/EdgeDetectionMaterial.js
var EdgeDetectionMaterial = class extends ShaderMaterial12 {
  /**
   * Constructs a new edge detection material.
   *
   * TODO Remove parameters.
   * @param {Vector2} [texelSize] - The screen texel size.
   * @param {EdgeDetectionMode} [mode=EdgeDetectionMode.COLOR] - The edge detection mode.
   */
  constructor(texelSize = new Vector27(), mode = EdgeDetectionMode.COLOR) {
    super({
      name: "EdgeDetectionMaterial",
      defines: {
        THREE_REVISION: REVISION2.replace(/\D+/g, ""),
        LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
        EDGE_THRESHOLD: "0.1",
        DEPTH_THRESHOLD: "0.01",
        PREDICATION_MODE: "0",
        PREDICATION_THRESHOLD: "0.01",
        PREDICATION_SCALE: "2.0",
        PREDICATION_STRENGTH: "1.0",
        DEPTH_PACKING: "0"
      },
      uniforms: {
        inputBuffer: new Uniform12(null),
        depthBuffer: new Uniform12(null),
        predicationBuffer: new Uniform12(null),
        texelSize: new Uniform12(texelSize)
      },
      blending: NoBlending12,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: edge_detection_default,
      vertexShader: edge_detection_default2
    });
    this.edgeDetectionMode = mode;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking5) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * The edge detection mode.
   *
   * @type {EdgeDetectionMode}
   */
  get edgeDetectionMode() {
    return Number(this.defines.EDGE_DETECTION_MODE);
  }
  set edgeDetectionMode(value) {
    this.defines.EDGE_DETECTION_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the edge detection mode.
   *
   * @deprecated Use edgeDetectionMode instead.
   * @return {EdgeDetectionMode} The mode.
   */
  getEdgeDetectionMode() {
    return this.edgeDetectionMode;
  }
  /**
   * Sets the edge detection mode.
   *
   * @deprecated Use edgeDetectionMode instead.
   * @param {EdgeDetectionMode} value - The edge detection mode.
   */
  setEdgeDetectionMode(value) {
    this.edgeDetectionMode = value;
  }
  /**
   * The local contrast adaptation factor. Has no effect if the edge detection mode is set to DEPTH. Default is 2.0.
   *
   * If a neighbor edge has _factor_ times bigger contrast than the current edge, the edge will be discarded.
   *
   * This allows to eliminate spurious crossing edges and is based on the fact that if there is too much contrast in a
   * direction, the perceptual contrast in the other neighbors will be hidden.
   *
   * @type {Number}
   */
  get localContrastAdaptationFactor() {
    return Number(this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR);
  }
  set localContrastAdaptationFactor(value) {
    this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the local contrast adaptation factor.
   *
   * @deprecated Use localContrastAdaptationFactor instead.
   * @return {Number} The factor.
   */
  getLocalContrastAdaptationFactor() {
    return this.localContrastAdaptationFactor;
  }
  /**
   * Sets the local contrast adaptation factor. Has no effect if the edge detection mode is set to DEPTH.
   *
   * @deprecated Use localContrastAdaptationFactor instead.
   * @param {Number} value - The local contrast adaptation factor. Default is 2.0.
   */
  setLocalContrastAdaptationFactor(value) {
    this.localContrastAdaptationFactor = value;
  }
  /**
   * The edge detection threshold. Range: [0.0, 0.5].
   *
   * A lower value results in more edges being detected at the expense of performance.
   *
   * For luma- and chroma-based edge detection, 0.1 is a reasonable value and allows to catch most visible edges. 0.05
   * is a rather overkill value that allows to catch 'em all. Darker scenes may require an even lower threshold.
   *
   * If depth-based edge detection is used, the threshold will depend on the scene depth.
   *
   * @type {Number}
   */
  get edgeDetectionThreshold() {
    return Number(this.defines.EDGE_THRESHOLD);
  }
  set edgeDetectionThreshold(value) {
    this.defines.EDGE_THRESHOLD = value.toFixed("6");
    this.defines.DEPTH_THRESHOLD = (value * 0.1).toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the edge detection threshold.
   *
   * @deprecated Use edgeDetectionThreshold instead.
   * @return {Number} The threshold.
   */
  getEdgeDetectionThreshold() {
    return this.edgeDetectionThreshold;
  }
  /**
   * Sets the edge detection threshold.
   *
   * @deprecated Use edgeDetectionThreshold instead.
   * @param {Number} value - The edge detection threshold. Range: [0.0, 0.5].
   */
  setEdgeDetectionThreshold(value) {
    this.edgeDetectionThreshold = value;
  }
  /**
   * The predication mode.
   *
   * Predicated thresholding allows to better preserve texture details and to improve edge detection using an additional
   * buffer such as a light accumulation or depth buffer.
   *
   * @type {PredicationMode}
   */
  get predicationMode() {
    return Number(this.defines.PREDICATION_MODE);
  }
  set predicationMode(value) {
    this.defines.PREDICATION_MODE = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Returns the predication mode.
   *
   * @deprecated Use predicationMode instead.
   * @return {PredicationMode} The mode.
   */
  getPredicationMode() {
    return this.predicationMode;
  }
  /**
   * Sets the predication mode.
   *
   * @deprecated Use predicationMode instead.
   * @param {PredicationMode} value - The predication mode.
   */
  setPredicationMode(value) {
    this.predicationMode = value;
  }
  /**
   * The predication buffer.
   *
   * @type {Texture}
   */
  set predicationBuffer(value) {
    this.uniforms.predicationBuffer.value = value;
  }
  /**
   * Sets a custom predication buffer.
   *
   * @deprecated Use predicationBuffer instead.
   * @param {Texture} value - The predication buffer.
   */
  setPredicationBuffer(value) {
    this.uniforms.predicationBuffer.value = value;
  }
  /**
   * The predication threshold.
   *
   * @type {Number}
   */
  get predicationThreshold() {
    return Number(this.defines.PREDICATION_THRESHOLD);
  }
  set predicationThreshold(value) {
    this.defines.PREDICATION_THRESHOLD = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication threshold.
   *
   * @deprecated Use predicationThreshold instead.
   * @return {Number} The threshold.
   */
  getPredicationThreshold() {
    return this.predicationThreshold;
  }
  /**
   * Sets the predication threshold.
   *
   * @deprecated Use predicationThreshold instead.
   * @param {Number} value - The threshold.
   */
  setPredicationThreshold(value) {
    this.predicationThreshold = value;
  }
  /**
   * The predication scale. Range: [1.0, 5.0].
   *
   * Determines how much the edge detection threshold should be scaled when using predication.
   *
   * @type {Boolean|Texture|Number}
   */
  get predicationScale() {
    return Number(this.defines.PREDICATION_SCALE);
  }
  set predicationScale(value) {
    this.defines.PREDICATION_SCALE = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication scale.
   *
   * @deprecated Use predicationScale instead.
   * @return {Number} The scale.
   */
  getPredicationScale() {
    return this.predicationScale;
  }
  /**
   * Sets the predication scale.
   *
   * @deprecated Use predicationScale instead.
   * @param {Number} value - The scale. Range: [1.0, 5.0].
   */
  setPredicationScale(value) {
    this.predicationScale = value;
  }
  /**
   * The predication strength. Range: [0.0, 1.0].
   *
   * Determines how much the edge detection threshold should be decreased locally when using predication.
   *
   * @type {Number}
   */
  get predicationStrength() {
    return Number(this.defines.PREDICATION_STRENGTH);
  }
  set predicationStrength(value) {
    this.defines.PREDICATION_STRENGTH = value.toFixed("6");
    this.needsUpdate = true;
  }
  /**
   * Returns the predication strength.
   *
   * @deprecated Use predicationStrength instead.
   * @return {Number} The strength.
   */
  getPredicationStrength() {
    return this.predicationStrength;
  }
  /**
   * Sets the predication strength.
   *
   * @deprecated Use predicationStrength instead.
   * @param {Number} value - The strength. Range: [0.0, 1.0].
   */
  setPredicationStrength(value) {
    this.predicationStrength = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/EffectMaterial.js
import { BasicDepthPacking as BasicDepthPacking6, NoBlending as NoBlending13, PerspectiveCamera as PerspectiveCamera5, REVISION as REVISION3, ShaderMaterial as ShaderMaterial13, Uniform as Uniform13, Vector2 as Vector28 } from "three";

// src/materials/glsl/effect.frag
var effect_default = "#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#define packFloatToRGBA(v) packDepthToRGBA(v)\n#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)\n#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#if DEPTH_PACKING == 3201\nuniform lowp sampler2D depthBuffer;\n#elif defined(GL_FRAGMENT_PRECISION_HIGH)\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;\n#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\n#if THREE_REVISION >= 137\nvec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}float getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNear,cameraFar);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNear,cameraFar);\n#endif\n}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;\n#ifdef ENCODE_OUTPUT\n#include <colorspace_fragment>\n#endif\n#include <dithering_fragment>\n}";

// src/materials/glsl/effect.vert
var effect_default2 = "uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/EffectMaterial.js
var EffectMaterial = class extends ShaderMaterial13 {
  /**
   * Constructs a new effect material.
   *
   * @param {Map<String, String>} [shaderParts] - Deprecated. Use setShaderData instead.
   * @param {Map<String, String>} [defines] - Deprecated. Use setShaderData instead.
   * @param {Map<String, Uniform>} [uniforms] - Deprecated. Use setShaderData instead.
   * @param {Camera} [camera] - A camera.
   * @param {Boolean} [dithering=false] - Deprecated.
   */
  constructor(shaderParts, defines, uniforms, camera, dithering = false) {
    super({
      name: "EffectMaterial",
      defines: {
        THREE_REVISION: REVISION3.replace(/\D+/g, ""),
        DEPTH_PACKING: "0",
        ENCODE_OUTPUT: "1"
      },
      uniforms: {
        inputBuffer: new Uniform13(null),
        depthBuffer: new Uniform13(null),
        resolution: new Uniform13(new Vector28()),
        texelSize: new Uniform13(new Vector28()),
        cameraNear: new Uniform13(0.3),
        cameraFar: new Uniform13(1e3),
        aspect: new Uniform13(1),
        time: new Uniform13(0)
      },
      blending: NoBlending13,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      dithering
    });
    if (shaderParts) {
      this.setShaderParts(shaderParts);
    }
    if (defines) {
      this.setDefines(defines);
    }
    if (uniforms) {
      this.setUniforms(uniforms);
    }
    this.copyCameraSettings(camera);
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  get depthBuffer() {
    return this.uniforms.depthBuffer.value;
  }
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  get depthPacking() {
    return Number(this.defines.DEPTH_PACKING);
  }
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking6) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * Sets the shader data.
   *
   * @param {EffectShaderData} data - The shader data.
   * @return {EffectMaterial} This material.
   */
  setShaderData(data) {
    this.setShaderParts(data.shaderParts);
    this.setDefines(data.defines);
    this.setUniforms(data.uniforms);
    this.setExtensions(data.extensions);
  }
  /**
   * Sets the shader parts.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, String>} shaderParts - A collection of shader snippets. See {@link EffectShaderSection}.
   * @return {EffectMaterial} This material.
   */
  setShaderParts(shaderParts) {
    this.fragmentShader = effect_default.replace(EffectShaderSection.FRAGMENT_HEAD, shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "").replace(EffectShaderSection.FRAGMENT_MAIN_UV, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "").replace(EffectShaderSection.FRAGMENT_MAIN_IMAGE, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "");
    this.vertexShader = effect_default2.replace(EffectShaderSection.VERTEX_HEAD, shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "").replace(EffectShaderSection.VERTEX_MAIN_SUPPORT, shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "");
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
    this.needsUpdate = true;
    return this;
  }
  /**
   * Sets the shader macros.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, String>} defines - A collection of preprocessor macro definitions.
   * @return {EffectMaterial} This material.
   */
  setDefines(defines) {
    for (const entry of defines.entries()) {
      this.defines[entry[0]] = entry[1];
    }
    this.needsUpdate = true;
    return this;
  }
  /**
   * Sets the shader uniforms.
   *
   * @deprecated Use setShaderData instead.
   * @param {Map<String, Uniform>} uniforms - A collection of uniforms.
   * @return {EffectMaterial} This material.
   */
  setUniforms(uniforms) {
    for (const entry of uniforms.entries()) {
      this.uniforms[entry[0]] = entry[1];
    }
    return this;
  }
  /**
   * Sets the required shader extensions.
   *
   * @deprecated Use setShaderData instead.
   * @param {Set<WebGLExtension>} extensions - A collection of extensions.
   * @return {EffectMaterial} This material.
   */
  setExtensions(extensions) {
    this.extensions = {};
    for (const extension of extensions) {
      this.extensions[extension] = true;
    }
    return this;
  }
  /**
   * Indicates whether output encoding is enabled.
   *
   * @type {Boolean}
   */
  get encodeOutput() {
    return this.defines.ENCODE_OUTPUT !== void 0;
  }
  set encodeOutput(value) {
    if (this.encodeOutput !== value) {
      if (value) {
        this.defines.ENCODE_OUTPUT = "1";
      } else {
        delete this.defines.ENCODE_OUTPUT;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Indicates whether output encoding is enabled.
   *
   * @deprecated Use encodeOutput instead.
   * @return {Boolean} Whether output encoding is enabled.
   */
  isOutputEncodingEnabled(value) {
    return this.encodeOutput;
  }
  /**
   * Enables or disables output encoding.
   *
   * @deprecated Use encodeOutput instead.
   * @param {Boolean} value - Whether output encoding should be enabled.
   */
  setOutputEncodingEnabled(value) {
    this.encodeOutput = value;
  }
  /**
   * The time in seconds.
   *
   * @type {Number}
   */
  get time() {
    return this.uniforms.time.value;
  }
  set time(value) {
    this.uniforms.time.value = value;
  }
  /**
   * Sets the delta time.
   *
   * @deprecated Use time instead.
   * @param {Number} value - The delta time in seconds.
   */
  setDeltaTime(value) {
    this.uniforms.time.value += value;
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNear.value = camera.near;
      this.uniforms.cameraFar.value = camera.far;
      if (camera instanceof PerspectiveCamera5) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Sets the resolution.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    uniforms.resolution.value.set(width, height);
    uniforms.texelSize.value.set(1 / width, 1 / height);
    uniforms.aspect.value = width / height;
  }
  /**
   * An enumeration of shader code placeholders.
   *
   * @deprecated Use EffectShaderSection instead.
   * @type {Object}
   */
  static get Section() {
    return EffectShaderSection;
  }
};

// src/materials/GaussianBlurMaterial.js
import { NoBlending as NoBlending14, ShaderMaterial as ShaderMaterial14, Uniform as Uniform14, Vector2 as Vector29 } from "three";

// src/materials/glsl/convolution.gaussian.frag
var convolution_gaussian_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nuniform vec2 kernel[STEPS];varying vec2 vOffset;varying vec2 vUv;void main(){vec4 result=texture2D(inputBuffer,vUv)*kernel[0].y;for(int i=1;i<STEPS;++i){vec2 offset=kernel[i].x*vOffset;vec4 c0=texture2D(inputBuffer,vUv+offset);vec4 c1=texture2D(inputBuffer,vUv-offset);result+=(c0+c1)*kernel[i].y;}gl_FragColor=result;\n#include <colorspace_fragment>\n}";

// src/materials/glsl/convolution.gaussian.vert
var convolution_gaussian_default2 = "uniform vec2 texelSize;uniform vec2 direction;uniform float scale;varying vec2 vOffset;varying vec2 vUv;void main(){vOffset=direction*texelSize*scale;vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/GaussianBlurMaterial.js
var GaussianBlurMaterial = class extends ShaderMaterial14 {
  /**
   * Constructs a new convolution material.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.kernelSize=35] - The kernel size.
   */
  constructor({ kernelSize = 35 } = {}) {
    super({
      name: "GaussianBlurMaterial",
      uniforms: {
        inputBuffer: new Uniform14(null),
        texelSize: new Uniform14(new Vector29()),
        direction: new Uniform14(new Vector29()),
        kernel: new Uniform14(null),
        scale: new Uniform14(1)
      },
      blending: NoBlending14,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_gaussian_default,
      vertexShader: convolution_gaussian_default2
    });
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
    this._kernelSize = 0;
    this.kernelSize = kernelSize;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The kernel size.
   *
   * @type {Number}
   */
  get kernelSize() {
    return this._kernelSize;
  }
  set kernelSize(value) {
    this._kernelSize = value;
    this.generateKernel(value);
  }
  /**
   * The blur direction.
   *
   * @type {Vector2}
   */
  get direction() {
    return this.uniforms.direction.value;
  }
  /**
   * The blur kernel scale. Values greater than 1.0 may introduce artifacts.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.scale.value;
  }
  set scale(value) {
    this.uniforms.scale.value = value;
  }
  /**
   * Generates the Gauss kernel.
   *
   * @param {KernelSize} kernelSize - The kernel size. Should be an odd number.
   * @private
   */
  generateKernel(kernelSize) {
    const kernel = new GaussKernel(kernelSize);
    const steps = kernel.linearSteps;
    const kernelData = new Float64Array(steps * 2);
    for (let i = 0, j = 0; i < steps; ++i) {
      kernelData[j++] = kernel.linearOffsets[i];
      kernelData[j++] = kernel.linearWeights[i];
    }
    this.uniforms.kernel.value = kernelData;
    this.defines.STEPS = steps.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/GodRaysMaterial.js
import { NoBlending as NoBlending15, ShaderMaterial as ShaderMaterial15, Uniform as Uniform15 } from "three";

// src/materials/glsl/convolution.god-rays.frag
var convolution_god_rays_default = "#include <common>\n#include <dithering_pars_fragment>\n#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nuniform vec2 lightPosition;uniform float exposure;uniform float decay;uniform float density;uniform float weight;uniform float clampMax;varying vec2 vUv;void main(){vec2 coord=vUv;vec2 delta=lightPosition-coord;delta*=1.0/SAMPLES_FLOAT*density;float illuminationDecay=1.0;vec4 color=vec4(0.0);for(int i=0;i<SAMPLES_INT;++i){coord+=delta;vec4 texel=texture2D(inputBuffer,coord);texel*=illuminationDecay*weight;color+=texel;illuminationDecay*=decay;}gl_FragColor=clamp(color*exposure,0.0,clampMax);\n#include <dithering_fragment>\n}";

// src/materials/GodRaysMaterial.js
var GodRaysMaterial = class extends ShaderMaterial15 {
  /**
   * Constructs a new god rays material.
   *
   * TODO Remove lightPosition param.
   * @param {Vector2} lightPosition - Deprecated.
   */
  constructor(lightPosition) {
    super({
      name: "GodRaysMaterial",
      defines: {
        SAMPLES_INT: "60",
        SAMPLES_FLOAT: "60.0"
      },
      uniforms: {
        inputBuffer: new Uniform15(null),
        lightPosition: new Uniform15(lightPosition),
        density: new Uniform15(1),
        decay: new Uniform15(1),
        weight: new Uniform15(1),
        exposure: new Uniform15(1),
        clampMax: new Uniform15(1)
      },
      blending: NoBlending15,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_god_rays_default,
      vertexShader: common_default
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The screen space position of the light source.
   *
   * @type {Vector2}
   */
  get lightPosition() {
    return this.uniforms.lightPosition.value;
  }
  /**
   * Returns the screen space position of the light source.
   *
   * @deprecated Use lightPosition instead.
   * @return {Vector2} The position.
   */
  getLightPosition() {
    return this.uniforms.lightPosition.value;
  }
  /**
   * Sets the screen space position of the light source.
   *
   * @deprecated Use lightPosition instead.
   * @param {Vector2} value - The position.
   */
  setLightPosition(value) {
    this.uniforms.lightPosition.value = value;
  }
  /**
   * The density.
   *
   * @type {Number}
   */
  get density() {
    return this.uniforms.density.value;
  }
  set density(value) {
    this.uniforms.density.value = value;
  }
  /**
   * Returns the density.
   *
   * @deprecated Use density instead.
   * @return {Number} The density.
   */
  getDensity() {
    return this.uniforms.density.value;
  }
  /**
   * Sets the density.
   *
   * @deprecated Use density instead.
   * @param {Number} value - The density.
   */
  setDensity(value) {
    this.uniforms.density.value = value;
  }
  /**
   * The decay.
   *
   * @type {Number}
   */
  get decay() {
    return this.uniforms.decay.value;
  }
  set decay(value) {
    this.uniforms.decay.value = value;
  }
  /**
   * Returns the decay.
   *
   * @deprecated Use decay instead.
   * @return {Number} The decay.
   */
  getDecay() {
    return this.uniforms.decay.value;
  }
  /**
   * Sets the decay.
   *
   * @deprecated Use decay instead.
   * @param {Number} value - The decay.
   */
  setDecay(value) {
    this.uniforms.decay.value = value;
  }
  /**
   * The weight.
   *
   * @type {Number}
   */
  get weight() {
    return this.uniforms.weight.value;
  }
  set weight(value) {
    this.uniforms.weight.value = value;
  }
  /**
   * Returns the weight.
   *
   * @deprecated Use weight instead.
   * @return {Number} The weight.
   */
  getWeight() {
    return this.uniforms.weight.value;
  }
  /**
   * Sets the weight.
   *
   * @deprecated Use weight instead.
   * @param {Number} value - The weight.
   */
  setWeight(value) {
    this.uniforms.weight.value = value;
  }
  /**
   * The exposure.
   *
   * @type {Number}
   */
  get exposure() {
    return this.uniforms.exposure.value;
  }
  set exposure(value) {
    this.uniforms.exposure.value = value;
  }
  /**
   * Returns the exposure.
   *
   * @deprecated Use exposure instead.
   * @return {Number} The exposure.
   */
  getExposure() {
    return this.uniforms.exposure.value;
  }
  /**
   * Sets the exposure.
   *
   * @deprecated Use exposure instead.
   * @param {Number} value - The exposure.
   */
  setExposure(value) {
    this.uniforms.exposure.value = value;
  }
  /**
   * The maximum light intensity.
   *
   * @type {Number}
   */
  get maxIntensity() {
    return this.uniforms.clampMax.value;
  }
  set maxIntensity(value) {
    this.uniforms.clampMax.value = value;
  }
  /**
   * Returns the maximum light intensity.
   *
   * @deprecated Use maxIntensity instead.
   * @return {Number} The maximum light intensity.
   */
  getMaxIntensity() {
    return this.uniforms.clampMax.value;
  }
  /**
   * Sets the maximum light intensity.
   *
   * @deprecated Use maxIntensity instead.
   * @param {Number} value - The maximum light intensity.
   */
  setMaxIntensity(value) {
    this.uniforms.clampMax.value = value;
  }
  /**
   * The amount of samples per pixel.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.SAMPLES_INT);
  }
  set samples(value) {
    const s = Math.floor(value);
    this.defines.SAMPLES_INT = s.toFixed(0);
    this.defines.SAMPLES_FLOAT = s.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of samples per pixel.
   *
   * @deprecated Use samples instead.
   * @return {Number} The sample count.
   */
  getSamples() {
    return this.samples;
  }
  /**
   * Sets the amount of samples per pixel.
   *
   * @deprecated Use samples instead.
   * @param {Number} value - The sample count.
   */
  setSamples(value) {
    this.samples = value;
  }
};

// src/materials/LuminanceMaterial.js
import { NoBlending as NoBlending16, REVISION as REVISION4, ShaderMaterial as ShaderMaterial16, Uniform as Uniform16 } from "three";

// src/materials/glsl/luminance.frag
var luminance_default = "#include <common>\n#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\n#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#ifdef RANGE\nuniform vec2 range;\n#elif defined(THRESHOLD)\nuniform float threshold;uniform float smoothing;\n#endif\nvarying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);\n#ifdef RANGE\nfloat low=step(range.x,l);float high=step(l,range.y);l*=low*high;\n#elif defined(THRESHOLD)\nl=smoothstep(threshold,threshold+smoothing,l)*l;\n#endif\n#ifdef COLOR\ngl_FragColor=vec4(texel.rgb*clamp(l,0.0,1.0),l);\n#else\ngl_FragColor=vec4(l);\n#endif\n}";

// src/materials/LuminanceMaterial.js
var LuminanceMaterial = class extends ShaderMaterial16 {
  /**
   * Constructs a new luminance material.
   *
   * @param {Boolean} [colorOutput=false] - Defines whether the shader should output colors scaled with their luminance value.
   * @param {Vector2} [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
   */
  constructor(colorOutput = false, luminanceRange = null) {
    super({
      name: "LuminanceMaterial",
      defines: {
        THREE_REVISION: REVISION4.replace(/\D+/g, "")
      },
      uniforms: {
        inputBuffer: new Uniform16(null),
        threshold: new Uniform16(0),
        smoothing: new Uniform16(1),
        range: new Uniform16(null)
      },
      blending: NoBlending16,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: luminance_default,
      vertexShader: common_default
    });
    this.colorOutput = colorOutput;
    this.luminanceRange = luminanceRange;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The luminance threshold.
   *
   * @type {Number}
   */
  get threshold() {
    return this.uniforms.threshold.value;
  }
  set threshold(value) {
    if (this.smoothing > 0 || value > 0) {
      this.defines.THRESHOLD = "1";
    } else {
      delete this.defines.THRESHOLD;
    }
    this.uniforms.threshold.value = value;
  }
  /**
   * Returns the luminance threshold.
   *
   * @deprecated Use threshold instead.
   * @return {Number} The threshold.
   */
  getThreshold() {
    return this.threshold;
  }
  /**
   * Sets the luminance threshold.
   *
   * @deprecated Use threshold instead.
   * @param {Number} value - The threshold.
   */
  setThreshold(value) {
    this.threshold = value;
  }
  /**
   * The luminance threshold smoothing.
   *
   * @type {Number}
   */
  get smoothing() {
    return this.uniforms.smoothing.value;
  }
  set smoothing(value) {
    if (this.threshold > 0 || value > 0) {
      this.defines.THRESHOLD = "1";
    } else {
      delete this.defines.THRESHOLD;
    }
    this.uniforms.smoothing.value = value;
  }
  /**
   * Returns the luminance threshold smoothing factor.
   *
   * @deprecated Use smoothing instead.
   * @return {Number} The smoothing factor.
   */
  getSmoothingFactor() {
    return this.smoothing;
  }
  /**
   * Sets the luminance threshold smoothing factor.
   *
   * @deprecated Use smoothing instead.
   * @param {Number} value - The smoothing factor.
   */
  setSmoothingFactor(value) {
    this.smoothing = value;
  }
  /**
   * Indicates whether the luminance threshold is enabled.
   *
   * @type {Boolean}
   * @deprecated Adjust the threshold or smoothing factor instead.
   */
  get useThreshold() {
    return this.threshold > 0 || this.smoothing > 0;
  }
  set useThreshold(value) {
  }
  /**
   * Indicates whether color output is enabled.
   *
   * @type {Boolean}
   */
  get colorOutput() {
    return this.defines.COLOR !== void 0;
  }
  set colorOutput(value) {
    if (value) {
      this.defines.COLOR = "1";
    } else {
      delete this.defines.COLOR;
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether color output is enabled.
   *
   * @deprecated Use colorOutput instead.
   * @return {Boolean} Whether color output is enabled.
   */
  isColorOutputEnabled(value) {
    return this.colorOutput;
  }
  /**
   * Enables or disables color output.
   *
   * @deprecated Use colorOutput instead.
   * @param {Boolean} value - Whether color output should be enabled.
   */
  setColorOutputEnabled(value) {
    this.colorOutput = value;
  }
  /**
   * Indicates whether luminance masking is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get useRange() {
    return this.luminanceRange !== null;
  }
  set useRange(value) {
    this.luminanceRange = null;
  }
  /**
   * The luminance range. Set to null to disable.
   *
   * @type {Boolean}
   */
  get luminanceRange() {
    return this.uniforms.range.value;
  }
  set luminanceRange(value) {
    if (value !== null) {
      this.defines.RANGE = "1";
    } else {
      delete this.defines.RANGE;
    }
    this.uniforms.range.value = value;
    this.needsUpdate = true;
  }
  /**
   * Returns the current luminance range.
   *
   * @deprecated Use luminanceRange instead.
   * @return {Vector2} The luminance range.
   */
  getLuminanceRange() {
    return this.luminanceRange;
  }
  /**
   * Sets a luminance range. Set to null to disable.
   *
   * @deprecated Use luminanceRange instead.
   * @param {Vector2} value - The luminance range.
   */
  setLuminanceRange(value) {
    this.luminanceRange = value;
  }
};

// src/materials/MaskMaterial.js
import { NoBlending as NoBlending17, ShaderMaterial as ShaderMaterial17, Uniform as Uniform17, UnsignedByteType } from "three";

// src/materials/glsl/mask.frag
var mask_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\n#ifdef MASK_PRECISION_HIGH\nuniform mediump sampler2D maskTexture;\n#else\nuniform lowp sampler2D maskTexture;\n#endif\n#if MASK_FUNCTION != 0\nuniform float strength;\n#endif\nvarying vec2 vUv;void main(){\n#if COLOR_CHANNEL == 0\nfloat mask=texture2D(maskTexture,vUv).r;\n#elif COLOR_CHANNEL == 1\nfloat mask=texture2D(maskTexture,vUv).g;\n#elif COLOR_CHANNEL == 2\nfloat mask=texture2D(maskTexture,vUv).b;\n#else\nfloat mask=texture2D(maskTexture,vUv).a;\n#endif\n#if MASK_FUNCTION == 0\n#ifdef INVERTED\nmask=step(mask,0.0);\n#else\nmask=1.0-step(mask,0.0);\n#endif\n#else\nmask=clamp(mask*strength,0.0,1.0);\n#ifdef INVERTED\nmask=1.0-mask;\n#endif\n#endif\n#if MASK_FUNCTION == 3\nvec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=vec4(mask*texel.rgb,texel.a);\n#elif MASK_FUNCTION == 2\ngl_FragColor=vec4(mask*texture2D(inputBuffer,vUv).rgb,mask);\n#else\ngl_FragColor=mask*texture2D(inputBuffer,vUv);\n#endif\n}";

// src/materials/MaskMaterial.js
var MaskMaterial = class extends ShaderMaterial17 {
  /**
   * Constructs a new mask material.
   *
   * @param {Texture} [maskTexture] - The mask texture.
   */
  constructor(maskTexture = null) {
    super({
      name: "MaskMaterial",
      uniforms: {
        maskTexture: new Uniform17(maskTexture),
        inputBuffer: new Uniform17(null),
        strength: new Uniform17(1)
      },
      blending: NoBlending17,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: mask_default,
      vertexShader: common_default
    });
    this.colorChannel = ColorChannel.RED;
    this.maskFunction = MaskFunction.DISCARD;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The mask texture.
   *
   * @type {Texture}
   */
  set maskTexture(value) {
    this.uniforms.maskTexture.value = value;
    delete this.defines.MASK_PRECISION_HIGH;
    if (value.type !== UnsignedByteType) {
      this.defines.MASK_PRECISION_HIGH = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the mask texture.
   *
   * @deprecated Use maskTexture instead.
   * @param {Texture} value - The texture.
   */
  setMaskTexture(value) {
    this.maskTexture = value;
  }
  /**
   * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
   *
   * @type {ColorChannel}
   */
  set colorChannel(value) {
    this.defines.COLOR_CHANNEL = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
   *
   * @deprecated Use colorChannel instead.
   * @param {ColorChannel} value - The channel.
   */
  setColorChannel(value) {
    this.colorChannel = value;
  }
  /**
   * The masking technique. Default is `MaskFunction.DISCARD`.
   *
   * @type {MaskFunction}
   */
  set maskFunction(value) {
    this.defines.MASK_FUNCTION = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the masking technique. Default is `MaskFunction.DISCARD`.
   *
   * @deprecated Use maskFunction instead.
   * @param {MaskFunction} value - The function.
   */
  setMaskFunction(value) {
    this.maskFunction = value;
  }
  /**
   * Indicates whether the masking is inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.defines.INVERTED !== void 0;
  }
  set inverted(value) {
    if (this.inverted && !value) {
      delete this.defines.INVERTED;
    } else if (value) {
      this.defines.INVERTED = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether the masking is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the masking is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Determines whether the masking should be inverted.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the masking should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * The current mask strength.
   *
   * Individual mask values will be clamped to [0.0, 1.0]. Has no effect when the mask function is set to `DISCARD`.
   *
   * @type {Number}
   */
  get strength() {
    return this.uniforms.strength.value;
  }
  set strength(value) {
    this.uniforms.strength.value = value;
  }
  /**
   * Returns the current mask strength.
   *
   * @deprecated Use strength instead.
   * @return {Number} The mask strength.
   */
  getStrength() {
    return this.strength;
  }
  /**
   * Sets the mask strength.
   *
   * Has no effect when the mask function is set to `DISCARD`.
   *
   * @deprecated Use strength instead.
   * @param {Number} value - The mask strength.
   */
  setStrength(value) {
    this.strength = value;
  }
};

// src/materials/OutlineMaterial.js
import { NoBlending as NoBlending18, ShaderMaterial as ShaderMaterial18, Uniform as Uniform18, Vector2 as Vector210 } from "three";

// src/materials/glsl/outline.frag
var outline_default = "uniform lowp sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 c0=texture2D(inputBuffer,vUv0).rg;vec2 c1=texture2D(inputBuffer,vUv1).rg;vec2 c2=texture2D(inputBuffer,vUv2).rg;vec2 c3=texture2D(inputBuffer,vUv3).rg;float d0=(c0.x-c1.x)*0.5;float d1=(c2.x-c3.x)*0.5;float d=length(vec2(d0,d1));float a0=min(c0.y,c1.y);float a1=min(c2.y,c3.y);float visibilityFactor=min(a0,a1);gl_FragColor.rg=(1.0-visibilityFactor>0.001)?vec2(d,0.0):vec2(0.0,d);}";

// src/materials/glsl/outline.vert
var outline_default2 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=vec2(uv.x+texelSize.x,uv.y);vUv1=vec2(uv.x-texelSize.x,uv.y);vUv2=vec2(uv.x,uv.y+texelSize.y);vUv3=vec2(uv.x,uv.y-texelSize.y);gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/OutlineMaterial.js
var OutlineMaterial = class extends ShaderMaterial18 {
  /**
   * Constructs a new outline material.
   *
   * TODO Remove texelSize param.
   * @param {Vector2} [texelSize] - The screen texel size.
   */
  constructor(texelSize = new Vector210()) {
    super({
      name: "OutlineMaterial",
      uniforms: {
        inputBuffer: new Uniform18(null),
        texelSize: new Uniform18(new Vector210())
      },
      blending: NoBlending18,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: outline_default,
      vertexShader: outline_default2
    });
    this.uniforms.texelSize.value.set(texelSize.x, texelSize.y);
    this.uniforms.maskTexture = this.uniforms.inputBuffer;
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/materials/SMAAWeightsMaterial.js
import { NoBlending as NoBlending19, ShaderMaterial as ShaderMaterial19, Uniform as Uniform19, Vector2 as Vector211 } from "three";

// src/materials/glsl/smaa-weights.frag
var smaa_weights_default = "#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + offset * texelSize)\n#if __VERSION__ < 300\n#define round(v) floor(v + 0.5)\n#endif\n#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nuniform lowp sampler2D areaTexture;uniform lowp sampler2D searchTexture;uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}vec2 decodeDiagBilinearAccess(in vec2 e){e.r=e.r*abs(5.0*e.r-5.0*0.75);return round(e);}vec4 decodeDiagBilinearAccess(in vec4 e){e.rb=e.rb*abs(5.0*e.rb-5.0*0.75);return round(e);}vec2 searchDiag1(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 searchDiag2(const in vec2 texCoord,const in vec2 dir,out vec2 e){vec4 coord=vec4(texCoord,-1.0,1.0);coord.x+=0.25*texelSize.x;vec3 t=vec3(texelSize,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(coord.z<float(MAX_SEARCH_STEPS_DIAG_INT-1)&&coord.w>0.9)){break;}coord.xyz=t*vec3(dir,1.0)+coord.xyz;e=texture2D(inputBuffer,coord.xy).rg;e=decodeDiagBilinearAccess(e);coord.w=dot(e,vec2(0.5));}return coord.zw;}vec2 areaDiag(const in vec2 dist,const in vec2 e,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE_DIAG,AREATEX_MAX_DISTANCE_DIAG)*e+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.x+=0.5;texCoord.y+=AREATEX_SUBTEX_SIZE*offset;return texture2D(areaTexture,texCoord).rg;}vec2 calculateDiagWeights(const in vec2 texCoord,const in vec2 e,const in vec4 subsampleIndices){vec2 weights=vec2(0.0);vec4 d;vec2 end;if(e.r>0.0){d.xz=searchDiag1(texCoord,vec2(-1.0,1.0),end);d.x+=float(end.y>0.9);}else{d.xz=vec2(0.0);}d.yw=searchDiag1(texCoord,vec2(1.0,-1.0),end);if(d.x+d.y>2.0){vec4 coords=vec4(-d.x+0.25,d.x,d.y,-d.y-0.25)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.xy=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).rg;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).rg;c.yxwz=decodeDiagBilinearAccess(c.xyzw);vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.z);}d.xz=searchDiag2(texCoord,vec2(-1.0,-1.0),end);if(sampleLevelZeroOffset(inputBuffer,texCoord,vec2(1,0)).r>0.0){d.yw=searchDiag2(texCoord,vec2(1.0),end);d.y+=float(end.y>0.9);}else{d.yw=vec2(0.0);}if(d.x+d.y>2.0){vec4 coords=vec4(-d.x,-d.x,d.y,d.y)*texelSize.xyxy+texCoord.xyxy;vec4 c;c.x=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(-1,0)).g;c.y=sampleLevelZeroOffset(inputBuffer,coords.xy,vec2(0,-1)).r;c.zw=sampleLevelZeroOffset(inputBuffer,coords.zw,vec2(1,0)).gr;vec2 cc=vec2(2.0)*c.xz+c.yw;movec(bvec2(step(0.9,d.zw)),cc,vec2(0.0));weights+=areaDiag(d.xy,cc,subsampleIndices.w).gr;}return weights;}float searchLength(const in vec2 e,const in float offset){vec2 scale=SEARCHTEX_SIZE*vec2(0.5,-1.0);vec2 bias=SEARCHTEX_SIZE*vec2(offset,1.0);scale+=vec2(-1.0,1.0);bias+=vec2(0.5,-0.5);scale*=1.0/SEARCHTEX_PACKED_SIZE;bias*=1.0/SEARCHTEX_PACKED_SIZE;return texture2D(searchTexture,scale*e+bias).r;}float searchXLeft(in vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x>end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(-2.0,0.0)*texelSize+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.0)+3.25;return texelSize.x*offset+texCoord.x;}float searchXRight(vec2 texCoord,const in float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.x<end&&e.g>0.8281&&e.r==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(2.0,0.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e,0.5)+3.25;return-texelSize.x*offset+texCoord.x;}float searchYUp(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;++i){if(!(texCoord.y>end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=-vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.0)+3.25;return texelSize.y*offset+texCoord.y;}float searchYDown(vec2 texCoord,const in float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<MAX_SEARCH_STEPS_INT;i++){if(!(texCoord.y<end&&e.r>0.8281&&e.g==0.0)){break;}e=texture2D(inputBuffer,texCoord).rg;texCoord=vec2(0.0,2.0)*texelSize.xy+texCoord;}float offset=-(255.0/127.0)*searchLength(e.gr,0.5)+3.25;return-texelSize.y*offset+texCoord.y;}vec2 area(const in vec2 dist,const in float e1,const in float e2,const in float offset){vec2 texCoord=vec2(AREATEX_MAX_DISTANCE)*round(4.0*vec2(e1,e2))+dist;texCoord=AREATEX_PIXEL_SIZE*texCoord+0.5*AREATEX_PIXEL_SIZE;texCoord.y=AREATEX_SUBTEX_SIZE*offset+texCoord.y;return texture2D(areaTexture,texCoord).rg;}void detectHorizontalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){\n#if !defined(DISABLE_CORNER_DETECTION)\nvec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,1)).r;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).r;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(0,-2)).r;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,-2)).r;weights*=clamp(factor,0.0,1.0);\n#endif\n}void detectVerticalCornerPattern(inout vec2 weights,const in vec4 texCoord,const in vec2 d){\n#if !defined(DISABLE_CORNER_DETECTION)\nvec2 leftRight=step(d.xy,d.yx);vec2 rounding=(1.0-CORNER_ROUNDING_NORM)*leftRight;rounding/=leftRight.x+leftRight.y;vec2 factor=vec2(1.0);factor.x-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(1,0)).g;factor.x-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(1,1)).g;factor.y-=rounding.x*sampleLevelZeroOffset(inputBuffer,texCoord.xy,vec2(-2,0)).g;factor.y-=rounding.y*sampleLevelZeroOffset(inputBuffer,texCoord.zw,vec2(-2,1)).g;weights*=clamp(factor,0.0,1.0);\n#endif\n}void main(){vec4 weights=vec4(0.0);vec4 subsampleIndices=vec4(0.0);vec2 e=texture2D(inputBuffer,vUv).rg;if(e.g>0.0){\n#if !defined(DISABLE_DIAG_DETECTION)\nweights.rg=calculateDiagWeights(vUv,e,subsampleIndices);if(weights.r==-weights.g){\n#endif\nvec2 d;vec3 coords;coords.x=searchXLeft(vOffset[0].xy,vOffset[2].x);coords.y=vOffset[1].y;d.x=coords.x;float e1=texture2D(inputBuffer,coords.xy).r;coords.z=searchXRight(vOffset[0].zw,vOffset[2].y);d.y=coords.z;d=round(resolution.xx*d+-vPixCoord.xx);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.zy,vec2(1,0)).r;weights.rg=area(sqrtD,e1,e2,subsampleIndices.y);coords.y=vUv.y;detectHorizontalCornerPattern(weights.rg,coords.xyzy,d);\n#if !defined(DISABLE_DIAG_DETECTION)\n}else{e.r=0.0;}\n#endif\n}if(e.r>0.0){vec2 d;vec3 coords;coords.y=searchYUp(vOffset[1].xy,vOffset[2].z);coords.x=vOffset[0].x;d.x=coords.y;float e1=texture2D(inputBuffer,coords.xy).g;coords.z=searchYDown(vOffset[1].zw,vOffset[2].w);d.y=coords.z;d=round(resolution.yy*d-vPixCoord.yy);vec2 sqrtD=sqrt(abs(d));float e2=sampleLevelZeroOffset(inputBuffer,coords.xz,vec2(0,1)).g;weights.ba=area(sqrtD,e1,e2,subsampleIndices.x);coords.x=vUv.x;detectVerticalCornerPattern(weights.ba,coords.xyxz,d);}gl_FragColor=weights;}";

// src/materials/glsl/smaa-weights.vert
var smaa_weights_default2 = "uniform vec2 texelSize;uniform vec2 resolution;varying vec2 vUv;varying vec4 vOffset[3];varying vec2 vPixCoord;void main(){vUv=position.xy*0.5+0.5;vPixCoord=vUv*resolution;vOffset[0]=vUv.xyxy+texelSize.xyxy*vec4(-0.25,-0.125,1.25,-0.125);vOffset[1]=vUv.xyxy+texelSize.xyxy*vec4(-0.125,-0.25,-0.125,1.25);vOffset[2]=vec4(vOffset[0].xz,vOffset[1].yw)+vec4(-2.0,2.0,-2.0,2.0)*texelSize.xxyy*MAX_SEARCH_STEPS_FLOAT;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/SMAAWeightsMaterial.js
var SMAAWeightsMaterial = class extends ShaderMaterial19 {
  /**
   * Constructs a new SMAA weights material.
   *
   * @param {Vector2} [texelSize] - The absolute screen texel size.
   * @param {Vector2} [resolution] - The resolution.
   */
  constructor(texelSize = new Vector211(), resolution = new Vector211()) {
    super({
      name: "SMAAWeightsMaterial",
      defines: {
        // Configurable settings:
        MAX_SEARCH_STEPS_INT: "16",
        MAX_SEARCH_STEPS_FLOAT: "16.0",
        MAX_SEARCH_STEPS_DIAG_INT: "8",
        MAX_SEARCH_STEPS_DIAG_FLOAT: "8.0",
        CORNER_ROUNDING: "25",
        CORNER_ROUNDING_NORM: "0.25",
        // Non-configurable settings:
        AREATEX_MAX_DISTANCE: "16.0",
        AREATEX_MAX_DISTANCE_DIAG: "20.0",
        AREATEX_PIXEL_SIZE: "(1.0 / vec2(160.0, 560.0))",
        AREATEX_SUBTEX_SIZE: "(1.0 / 7.0)",
        SEARCHTEX_SIZE: "vec2(66.0, 33.0)",
        SEARCHTEX_PACKED_SIZE: "vec2(64.0, 16.0)"
      },
      uniforms: {
        inputBuffer: new Uniform19(null),
        searchTexture: new Uniform19(null),
        areaTexture: new Uniform19(null),
        resolution: new Uniform19(resolution),
        texelSize: new Uniform19(texelSize)
      },
      blending: NoBlending19,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: smaa_weights_default,
      vertexShader: smaa_weights_default2
    });
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * Sets the input buffer.
   *
   * @deprecated Use inputBuffer instead.
   * @param {Texture} value - The input buffer.
   */
  setInputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * The search lookup texture.
   *
   * @type {Texture}
   */
  get searchTexture() {
    return this.uniforms.searchTexture.value;
  }
  set searchTexture(value) {
    this.uniforms.searchTexture.value = value;
  }
  /**
   * The area lookup texture.
   *
   * @type {Texture}
   */
  get areaTexture() {
    return this.uniforms.areaTexture.value;
  }
  set areaTexture(value) {
    this.uniforms.areaTexture.value = value;
  }
  /**
   * Sets the search and area lookup textures.
   *
   * @deprecated Use searchTexture and areaTexture instead.
   * @param {Texture} search - The search lookup texture.
   * @param {Texture} area - The area lookup texture.
   */
  setLookupTextures(search, area2) {
    this.searchTexture = search;
    this.areaTexture = area2;
  }
  /**
   * The maximum amount of steps performed in the horizontal/vertical pattern searches, at each side of the pixel.
   * Range: [0, 112].
   *
   * In number of pixels, it's actually the double. So the maximum line length perfectly handled by, for example 16, is
   * 64 (perfectly means that longer lines won't look as good, but are still antialiased).
   *
   * @type {Number}
   */
  get orthogonalSearchSteps() {
    return Number(this.defines.MAX_SEARCH_STEPS_INT);
  }
  set orthogonalSearchSteps(value) {
    const s = Math.min(Math.max(value, 0), 112);
    this.defines.MAX_SEARCH_STEPS_INT = s.toFixed("0");
    this.defines.MAX_SEARCH_STEPS_FLOAT = s.toFixed("1");
    this.needsUpdate = true;
  }
  /**
   * Sets the maximum amount of steps performed in the horizontal/vertical pattern searches, at each side of the pixel.
   *
   * @deprecated Use orthogonalSearchSteps instead.
   * @param {Number} value - The search steps. Range: [0, 112].
   */
  setOrthogonalSearchSteps(value) {
    this.orthogonalSearchSteps = value;
  }
  /**
   * The maximum steps performed in the diagonal pattern searches, at each side of the pixel. This search
   * jumps one pixel at a time. Range: [0, 20].
   *
   * On high-end machines this search is cheap (between 0.8x and 0.9x slower for 16 steps), but it can have a
   * significant impact on older machines.
   *
   * @type {Number}
   */
  get diagonalSearchSteps() {
    return Number(this.defines.MAX_SEARCH_STEPS_DIAG_INT);
  }
  set diagonalSearchSteps(value) {
    const s = Math.min(Math.max(value, 0), 20);
    this.defines.MAX_SEARCH_STEPS_DIAG_INT = s.toFixed("0");
    this.defines.MAX_SEARCH_STEPS_DIAG_FLOAT = s.toFixed("1");
    this.needsUpdate = true;
  }
  /**
   * Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel.
   *
   * @deprecated Use diagonalSearchSteps instead.
   * @param {Number} value - The search steps. Range: [0, 20].
   */
  setDiagonalSearchSteps(value) {
    this.diagonalSearchSteps = value;
  }
  /**
   * Indicates whether diagonal pattern detection is enabled.
   *
   * @type {Boolean}
   */
  get diagonalDetection() {
    return this.defines.DISABLE_DIAG_DETECTION === void 0;
  }
  set diagonalDetection(value) {
    if (value) {
      delete this.defines.DISABLE_DIAG_DETECTION;
    } else {
      this.defines.DISABLE_DIAG_DETECTION = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether diagonal pattern detection is enabled.
   *
   * @deprecated Use diagonalDetection instead.
   * @return {Boolean} Whether diagonal pattern detection is enabled.
   */
  isDiagonalDetectionEnabled() {
    return this.diagonalDetection;
  }
  /**
   * Enables or disables diagonal pattern detection.
   *
   * @deprecated Use diagonalDetection instead.
   * @param {Boolean} value - Whether diagonal pattern detection should be enabled.
   */
  setDiagonalDetectionEnabled(value) {
    this.diagonalDetection = value;
  }
  /**
   * Specifies how much sharp corners will be rounded. Range: [0, 100].
   *
   * @type {Number}
   */
  get cornerRounding() {
    return Number(this.defines.CORNER_ROUNDING);
  }
  set cornerRounding(value) {
    const r = Math.min(Math.max(value, 0), 100);
    this.defines.CORNER_ROUNDING = r.toFixed("4");
    this.defines.CORNER_ROUNDING_NORM = (r / 100).toFixed("4");
    this.needsUpdate = true;
  }
  /**
   * Specifies how much sharp corners will be rounded.
   *
   * @deprecated Use cornerRounding instead.
   * @param {Number} value - The corner rounding amount. Range: [0, 100].
   */
  setCornerRounding(value) {
    this.cornerRounding = value;
  }
  /**
   * Indicates whether corner detection is enabled.
   *
   * @type {Number}
   */
  get cornerDetection() {
    return this.defines.DISABLE_CORNER_DETECTION === void 0;
  }
  set cornerDetection(value) {
    if (value) {
      delete this.defines.DISABLE_CORNER_DETECTION;
    } else {
      this.defines.DISABLE_CORNER_DETECTION = "1";
    }
    this.needsUpdate = true;
  }
  /**
   * Indicates whether corner rounding is enabled.
   *
   * @deprecated Use cornerDetection instead.
   * @return {Boolean} Whether corner rounding is enabled.
   */
  isCornerRoundingEnabled() {
    return this.cornerDetection;
  }
  /**
   * Enables or disables corner rounding.
   *
   * @deprecated Use cornerDetection instead.
   * @param {Boolean} value - Whether corner rounding should be enabled.
   */
  setCornerRoundingEnabled(value) {
    this.cornerDetection = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    uniforms.texelSize.value.set(1 / width, 1 / height);
    uniforms.resolution.value.set(width, height);
  }
};

// src/materials/SSAOMaterial.js
import { BasicDepthPacking as BasicDepthPacking7, Matrix4, NoBlending as NoBlending20, PerspectiveCamera as PerspectiveCamera6, ShaderMaterial as ShaderMaterial20, Uniform as Uniform20, Vector2 as Vector212 } from "three";

// src/materials/glsl/ssao.frag
var ssao_default = "#include <common>\n#include <packing>\n#ifdef NORMAL_DEPTH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D normalDepthBuffer;\n#else\nuniform mediump sampler2D normalDepthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){return texture2D(normalDepthBuffer,uv).a;}\n#else\nuniform lowp sampler2D normalBuffer;\n#if DEPTH_PACKING == 3201\nuniform lowp sampler2D depthBuffer;\n#elif defined(GL_FRAGMENT_PRECISION_HIGH)\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}\n#endif\nuniform lowp sampler2D noiseTexture;uniform mat4 inverseProjectionMatrix;uniform mat4 projectionMatrix;uniform vec2 texelSize;uniform vec2 cameraNearFar;uniform float intensity;uniform float minRadiusScale;uniform float fade;uniform float bias;uniform vec2 distanceCutoff;uniform vec2 proximityCutoff;varying vec2 vUv;varying vec2 vUv2;float getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNearFar.x,cameraNearFar.y);\n#endif\n}vec3 getViewPosition(const in vec2 screenPosition,const in float depth,const in float viewZ){vec4 clipPosition=vec4(vec3(screenPosition,depth)*2.0-1.0,1.0);float clipW=projectionMatrix[2][3]*viewZ+projectionMatrix[3][3];clipPosition*=clipW;return(inverseProjectionMatrix*clipPosition).xyz;}float getAmbientOcclusion(const in vec3 p,const in vec3 n,const in float depth,const in vec2 uv){float radiusScale=1.0-smoothstep(0.0,distanceCutoff.y,depth);radiusScale=radiusScale*(1.0-minRadiusScale)+minRadiusScale;float radius=RADIUS*radiusScale;float noise=texture2D(noiseTexture,vUv2).r;float baseAngle=noise*PI2;float rings=SPIRAL_TURNS*PI2;float occlusion=0.0;int taps=0;for(int i=0;i<SAMPLES_INT;++i){float alpha=(float(i)+0.5)*INV_SAMPLES_FLOAT;float angle=alpha*rings+baseAngle;vec2 rotation=vec2(cos(angle),sin(angle));vec2 coords=alpha*radius*rotation*texelSize+uv;if(coords.s<0.0||coords.s>1.0||coords.t<0.0||coords.t>1.0){continue;}float sampleDepth=readDepth(coords);float viewZ=getViewZ(sampleDepth);\n#ifdef PERSPECTIVE_CAMERA\nfloat linearSampleDepth=viewZToOrthographicDepth(viewZ,cameraNearFar.x,cameraNearFar.y);\n#else\nfloat linearSampleDepth=sampleDepth;\n#endif\nfloat proximity=abs(depth-linearSampleDepth);if(proximity<proximityCutoff.y){float falloff=1.0-smoothstep(proximityCutoff.x,proximityCutoff.y,proximity);vec3 Q=getViewPosition(coords,sampleDepth,viewZ);vec3 v=Q-p;float vv=dot(v,v);float vn=dot(v,n)-bias;float f=max(RADIUS_SQ-vv,0.0)/RADIUS_SQ;occlusion+=(f*f*f*max(vn/(fade+vv),0.0))*falloff;}++taps;}return occlusion/(4.0*max(float(taps),1.0));}void main(){\n#ifdef NORMAL_DEPTH\nvec4 normalDepth=texture2D(normalDepthBuffer,vUv);\n#else\nvec4 normalDepth=vec4(texture2D(normalBuffer,vUv).xyz,readDepth(vUv));\n#endif\nfloat ao=0.0;float depth=normalDepth.a;float viewZ=getViewZ(depth);\n#ifdef PERSPECTIVE_CAMERA\nfloat linearDepth=viewZToOrthographicDepth(viewZ,cameraNearFar.x,cameraNearFar.y);\n#else\nfloat linearDepth=depth;\n#endif\nif(linearDepth<distanceCutoff.y){vec3 viewPosition=getViewPosition(vUv,depth,viewZ);vec3 viewNormal=unpackRGBToNormal(normalDepth.rgb);ao+=getAmbientOcclusion(viewPosition,viewNormal,linearDepth,vUv);float d=smoothstep(distanceCutoff.x,distanceCutoff.y,linearDepth);ao=mix(ao,0.0,d);\n#ifdef LEGACY_INTENSITY\nao=clamp(1.0-pow(1.0-ao,abs(intensity)),0.0,1.0);\n#endif\n}gl_FragColor.r=ao;}";

// src/materials/glsl/ssao.vert
var ssao_default2 = "uniform vec2 noiseScale;varying vec2 vUv;varying vec2 vUv2;void main(){vUv=position.xy*0.5+0.5;vUv2=vUv*noiseScale;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/SSAOMaterial.js
var SSAOMaterial = class extends ShaderMaterial20 {
  /**
   * Constructs a new SSAO material.
   *
   * @param {Camera} camera - A camera.
   */
  constructor(camera) {
    super({
      name: "SSAOMaterial",
      defines: {
        SAMPLES_INT: "0",
        INV_SAMPLES_FLOAT: "0.0",
        SPIRAL_TURNS: "0.0",
        RADIUS: "1.0",
        RADIUS_SQ: "1.0",
        DISTANCE_SCALING: "1",
        DEPTH_PACKING: "0"
      },
      uniforms: {
        depthBuffer: new Uniform20(null),
        normalBuffer: new Uniform20(null),
        normalDepthBuffer: new Uniform20(null),
        noiseTexture: new Uniform20(null),
        inverseProjectionMatrix: new Uniform20(new Matrix4()),
        projectionMatrix: new Uniform20(new Matrix4()),
        texelSize: new Uniform20(new Vector212()),
        cameraNearFar: new Uniform20(new Vector212()),
        distanceCutoff: new Uniform20(new Vector212()),
        proximityCutoff: new Uniform20(new Vector212()),
        noiseScale: new Uniform20(new Vector212()),
        minRadiusScale: new Uniform20(0.33),
        intensity: new Uniform20(1),
        fade: new Uniform20(0.01),
        bias: new Uniform20(0)
      },
      blending: NoBlending20,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: ssao_default,
      vertexShader: ssao_default2
    });
    this.copyCameraSettings(camera);
    this.resolution = new Vector212();
    this.r = 1;
  }
  /**
   * The current near plane setting.
   *
   * @type {Number}
   * @private
   */
  get near() {
    return this.uniforms.cameraNearFar.value.x;
  }
  /**
   * The current far plane setting.
   *
   * @type {Number}
   * @private
   */
  get far() {
    return this.uniforms.cameraNearFar.value.y;
  }
  /**
   * A combined normal-depth buffer.
   *
   * @type {Texture}
   */
  set normalDepthBuffer(value) {
    this.uniforms.normalDepthBuffer.value = value;
    if (value !== null) {
      this.defines.NORMAL_DEPTH = "1";
    } else {
      delete this.defines.NORMAL_DEPTH;
    }
    this.needsUpdate = true;
  }
  /**
   * Sets the combined normal-depth buffer.
   *
   * @deprecated Use normalDepthBuffer instead.
   * @param {Number} value - The buffer.
   */
  setNormalDepthBuffer(value) {
    this.normalDepthBuffer = value;
  }
  /**
   * The normal buffer.
   *
   * @type {Texture}
   */
  set normalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
  }
  /**
   * Sets the normal buffer.
   *
   * @deprecated Use normalBuffer instead.
   * @param {Number} value - The buffer.
   */
  setNormalBuffer(value) {
    this.uniforms.normalBuffer.value = value;
  }
  /**
   * The depth buffer.
   *
   * @type {Texture}
   */
  set depthBuffer(value) {
    this.uniforms.depthBuffer.value = value;
  }
  /**
   * The depth packing strategy.
   *
   * @type {DepthPackingStrategies}
   */
  set depthPacking(value) {
    this.defines.DEPTH_PACKING = value.toFixed(0);
    this.needsUpdate = true;
  }
  /**
   * Sets the depth buffer.
   *
   * @deprecated Use depthBuffer and depthPacking instead.
   * @param {Texture} buffer - The depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthBuffer(buffer, depthPacking = BasicDepthPacking7) {
    this.depthBuffer = buffer;
    this.depthPacking = depthPacking;
  }
  /**
   * The noise texture.
   *
   * @type {Texture}
   */
  set noiseTexture(value) {
    this.uniforms.noiseTexture.value = value;
  }
  /**
   * Sets the noise texture.
   *
   * @deprecated Use noiseTexture instead.
   * @param {Number} value - The texture.
   */
  setNoiseTexture(value) {
    this.uniforms.noiseTexture.value = value;
  }
  /**
   * The sample count.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.SAMPLES_INT);
  }
  set samples(value) {
    this.defines.SAMPLES_INT = value.toFixed(0);
    this.defines.INV_SAMPLES_FLOAT = (1 / value).toFixed(9);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of occlusion samples per pixel.
   *
   * @deprecated Use samples instead.
   * @return {Number} The sample count.
   */
  getSamples() {
    return this.samples;
  }
  /**
   * Sets the amount of occlusion samples per pixel.
   *
   * @deprecated Use samples instead.
   * @param {Number} value - The sample count.
   */
  setSamples(value) {
    this.samples = value;
  }
  /**
   * The sampling spiral ring count.
   *
   * @type {Number}
   */
  get rings() {
    return Number(this.defines.SPIRAL_TURNS);
  }
  set rings(value) {
    this.defines.SPIRAL_TURNS = value.toFixed(1);
    this.needsUpdate = true;
  }
  /**
   * Returns the amount of spiral turns in the occlusion sampling pattern.
   *
   * @deprecated Use rings instead.
   * @return {Number} The radius.
   */
  getRings() {
    return this.rings;
  }
  /**
   * Sets the amount of spiral turns in the occlusion sampling pattern.
   *
   * @deprecated Use rings instead.
   * @param {Number} value - The radius.
   */
  setRings(value) {
    this.rings = value;
  }
  /**
   * The intensity.
   *
   * @type {Number}
   * @deprecated Use SSAOEffect.intensity instead.
   */
  get intensity() {
    return this.uniforms.intensity.value;
  }
  set intensity(value) {
    this.uniforms.intensity.value = value;
    if (this.defines.LEGACY_INTENSITY === void 0) {
      this.defines.LEGACY_INTENSITY = "1";
      this.needsUpdate = true;
    }
  }
  /**
   * Returns the intensity.
   *
   * @deprecated Use SSAOEffect.intensity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.uniforms.intensity.value;
  }
  /**
   * Sets the intensity.
   *
   * @deprecated Use SSAOEffect.intensity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.uniforms.intensity.value = value;
  }
  /**
   * The depth fade factor.
   *
   * @type {Number}
   */
  get fade() {
    return this.uniforms.fade.value;
  }
  set fade(value) {
    this.uniforms.fade.value = value;
  }
  /**
   * Returns the depth fade factor.
   *
   * @deprecated Use fade instead.
   * @return {Number} The fade factor.
   */
  getFade() {
    return this.uniforms.fade.value;
  }
  /**
   * Sets the depth fade factor.
   *
   * @deprecated Use fade instead.
   * @param {Number} value - The fade factor.
   */
  setFade(value) {
    this.uniforms.fade.value = value;
  }
  /**
   * The depth bias. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get bias() {
    return this.uniforms.bias.value;
  }
  set bias(value) {
    this.uniforms.bias.value = value;
  }
  /**
   * Returns the depth bias.
   *
   * @deprecated Use bias instead.
   * @return {Number} The bias.
   */
  getBias() {
    return this.uniforms.bias.value;
  }
  /**
   * Sets the depth bias.
   *
   * @deprecated Use bias instead.
   * @param {Number} value - The bias.
   */
  setBias(value) {
    this.uniforms.bias.value = value;
  }
  /**
   * The minimum radius scale for distance scaling. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get minRadiusScale() {
    return this.uniforms.minRadiusScale.value;
  }
  set minRadiusScale(value) {
    this.uniforms.minRadiusScale.value = value;
  }
  /**
   * Returns the minimum radius scale for distance scaling.
   *
   * @deprecated Use minRadiusScale instead.
   * @return {Number} The minimum radius scale.
   */
  getMinRadiusScale() {
    return this.uniforms.minRadiusScale.value;
  }
  /**
   * Sets the minimum radius scale for distance scaling.
   *
   * @deprecated Use minRadiusScale instead.
   * @param {Number} value - The minimum radius scale.
   */
  setMinRadiusScale(value) {
    this.uniforms.minRadiusScale.value = value;
  }
  /**
   * Updates the absolute radius.
   *
   * @private
   */
  updateRadius() {
    const radius = this.r * this.resolution.height;
    this.defines.RADIUS = radius.toFixed(11);
    this.defines.RADIUS_SQ = (radius * radius).toFixed(11);
    this.needsUpdate = true;
  }
  /**
   * The occlusion sampling radius. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get radius() {
    return this.r;
  }
  set radius(value) {
    this.r = Math.min(Math.max(value, 1e-6), 1);
    this.updateRadius();
  }
  /**
   * Returns the occlusion sampling radius.
   *
   * @deprecated Use radius instead.
   * @return {Number} The radius.
   */
  getRadius() {
    return this.radius;
  }
  /**
   * Sets the occlusion sampling radius.
   *
   * @deprecated Use radius instead.
   * @param {Number} value - The radius. Range [1e-6, 1.0].
   */
  setRadius(value) {
    this.radius = value;
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get distanceScaling() {
    return true;
  }
  set distanceScaling(value) {
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @deprecated
   * @return {Boolean} Whether distance scaling is enabled.
   */
  isDistanceScalingEnabled() {
    return this.distanceScaling;
  }
  /**
   * Enables or disables distance-based radius scaling.
   *
   * @deprecated
   * @param {Boolean} value - Whether distance scaling should be enabled.
   */
  setDistanceScalingEnabled(value) {
    this.distanceScaling = value;
  }
  /**
   * The occlusion distance threshold. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get distanceThreshold() {
    return this.uniforms.distanceCutoff.value.x;
  }
  set distanceThreshold(value) {
    this.uniforms.distanceCutoff.value.set(
      Math.min(Math.max(value, 0), 1),
      Math.min(Math.max(value + this.distanceFalloff, 0), 1)
    );
  }
  /**
   * The occlusion distance threshold in world units.
   *
   * @type {Number}
   */
  get worldDistanceThreshold() {
    return -orthographicDepthToViewZ(this.distanceThreshold, this.near, this.far);
  }
  set worldDistanceThreshold(value) {
    this.distanceThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * The occlusion distance falloff. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get distanceFalloff() {
    return this.uniforms.distanceCutoff.value.y - this.distanceThreshold;
  }
  set distanceFalloff(value) {
    this.uniforms.distanceCutoff.value.y = Math.min(Math.max(this.distanceThreshold + value, 0), 1);
  }
  /**
   * The occlusion distance falloff in world units.
   *
   * @type {Number}
   */
  get worldDistanceFalloff() {
    return -orthographicDepthToViewZ(this.distanceFalloff, this.near, this.far);
  }
  set worldDistanceFalloff(value) {
    this.distanceFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Sets the occlusion distance cutoff.
   *
   * @deprecated Use distanceThreshold and distanceFalloff instead.
   * @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setDistanceCutoff(threshold, falloff) {
    this.uniforms.distanceCutoff.value.set(
      Math.min(Math.max(threshold, 0), 1),
      Math.min(Math.max(threshold + falloff, 0), 1)
    );
  }
  /**
   * The occlusion proximity threshold. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get proximityThreshold() {
    return this.uniforms.proximityCutoff.value.x;
  }
  set proximityThreshold(value) {
    this.uniforms.proximityCutoff.value.set(
      Math.min(Math.max(value, 0), 1),
      Math.min(Math.max(value + this.proximityFalloff, 0), 1)
    );
  }
  /**
   * The occlusion proximity threshold in world units.
   *
   * @type {Number}
   */
  get worldProximityThreshold() {
    return -orthographicDepthToViewZ(this.proximityThreshold, this.near, this.far);
  }
  set worldProximityThreshold(value) {
    this.proximityThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * The occlusion proximity falloff. Range: [0.0, 1.0].
   *
   * @type {Number}
   */
  get proximityFalloff() {
    return this.uniforms.proximityCutoff.value.y - this.proximityThreshold;
  }
  set proximityFalloff(value) {
    this.uniforms.proximityCutoff.value.y = Math.min(Math.max(this.proximityThreshold + value, 0), 1);
  }
  /**
   * The occlusion proximity falloff in world units.
   *
   * @type {Number}
   */
  get worldProximityFalloff() {
    return -orthographicDepthToViewZ(this.proximityFalloff, this.near, this.far);
  }
  set worldProximityFalloff(value) {
    this.proximityFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
  }
  /**
   * Sets the occlusion proximity cutoff.
   *
   * @deprecated Use proximityThreshold and proximityFalloff instead.
   * @param {Number} threshold - The range threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setProximityCutoff(threshold, falloff) {
    this.uniforms.proximityCutoff.value.set(
      Math.min(Math.max(threshold, 0), 1),
      Math.min(Math.max(threshold + falloff, 0), 1)
    );
  }
  /**
   * Sets the texel size.
   *
   * @deprecated Use setSize() instead.
   * @param {Number} x - The texel width.
   * @param {Number} y - The texel height.
   */
  setTexelSize(x, y) {
    this.uniforms.texelSize.value.set(x, y);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @deprecated Use copyCameraSettings instead.
   * @param {Camera} camera - A camera.
   */
  adoptCameraSettings(camera) {
    this.copyCameraSettings(camera);
  }
  /**
   * Copies the settings of the given camera.
   *
   * @param {Camera} camera - A camera.
   */
  copyCameraSettings(camera) {
    if (camera) {
      this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
      this.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
      this.uniforms.inverseProjectionMatrix.value.copy(camera.projectionMatrix).invert();
      if (camera instanceof PerspectiveCamera6) {
        this.defines.PERSPECTIVE_CAMERA = "1";
      } else {
        delete this.defines.PERSPECTIVE_CAMERA;
      }
      this.needsUpdate = true;
    }
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const uniforms = this.uniforms;
    const noiseTexture = uniforms.noiseTexture.value;
    if (noiseTexture !== null) {
      uniforms.noiseScale.value.set(
        width / noiseTexture.image.width,
        height / noiseTexture.image.height
      );
    }
    uniforms.texelSize.value.set(1 / width, 1 / height);
    this.resolution.set(width, height);
    this.updateRadius();
  }
};

// src/materials/TiltShiftBlurMaterial.js
import { Uniform as Uniform21, Vector2 as Vector213, Vector4 as Vector42 } from "three";

// src/materials/glsl/convolution.tilt-shift.frag
var convolution_tilt_shift_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;\n#else\nuniform lowp sampler2D inputBuffer;\n#endif\nuniform vec4 maskParams;varying vec2 vUv;varying vec2 vUv2;varying vec2 vOffset;float linearGradientMask(const in float x){return smoothstep(maskParams.x,maskParams.y,x)-smoothstep(maskParams.w,maskParams.z,x);}void main(){vec2 dUv=vOffset*(1.0-linearGradientMask(vUv2.y));vec4 sum=texture2D(inputBuffer,vec2(vUv.x-dUv.x,vUv.y+dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x+dUv.x,vUv.y+dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x+dUv.x,vUv.y-dUv.y));sum+=texture2D(inputBuffer,vec2(vUv.x-dUv.x,vUv.y-dUv.y));gl_FragColor=sum*0.25;\n#include <colorspace_fragment>\n}";

// src/materials/glsl/convolution.tilt-shift.vert
var convolution_tilt_shift_default2 = "uniform vec4 texelSize;uniform float kernel;uniform float scale;uniform float aspect;uniform vec2 rotation;varying vec2 vUv;varying vec2 vUv2;varying vec2 vOffset;void main(){vec2 uv=position.xy*0.5+0.5;vUv=uv;vUv2=(uv-0.5)*2.0*vec2(aspect,1.0);vUv2=vec2(dot(rotation,vUv2),dot(rotation,vec2(vUv2.y,-vUv2.x)));vOffset=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/TiltShiftBlurMaterial.js
var TiltShiftBlurMaterial = class extends KawaseBlurMaterial {
  /**
   * Constructs a new tilt shift blur material.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   */
  constructor({
    kernelSize = KernelSize.MEDIUM,
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3
  } = {}) {
    super();
    this.fragmentShader = convolution_tilt_shift_default;
    this.vertexShader = convolution_tilt_shift_default2;
    this.kernelSize = kernelSize;
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
    this.uniforms.aspect = new Uniform21(1);
    this.uniforms.rotation = new Uniform21(new Vector213());
    this.uniforms.maskParams = new Uniform21(new Vector42());
    this._offset = offset;
    this._focusArea = focusArea;
    this._feather = feather;
    this.rotation = rotation;
    this.updateParams();
  }
  /**
   * The relative offset of the focus area.
   *
   * @private
   */
  updateParams() {
    const params = this.uniforms.maskParams.value;
    const a = Math.max(this.focusArea, 0);
    const b = Math.max(a - this.feather, 0);
    params.set(
      this.offset - a,
      this.offset - b,
      this.offset + a,
      this.offset + b
    );
  }
  /**
   * The rotation of the focus area in radians.
   *
   * @type {Number}
   */
  get rotation() {
    return Math.acos(this.uniforms.rotation.value.x);
  }
  set rotation(value) {
    this.uniforms.rotation.value.set(Math.cos(value), Math.sin(value));
  }
  /**
   * The relative offset of the focus area.
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = value;
    this.updateParams();
  }
  /**
   * The relative size of the focus area.
   *
   * @type {Number}
   */
  get focusArea() {
    return this._focusArea;
  }
  set focusArea(value) {
    this._focusArea = value;
    this.updateParams();
  }
  /**
   * The softness of the focus area edges.
   *
   * @type {Number}
   */
  get feather() {
    return this._feather;
  }
  set feather(value) {
    this._feather = value;
    this.updateParams();
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    super.setSize(width, height);
    this.uniforms.aspect.value = width / height;
  }
};

// src/materials/UpsamplingMaterial.js
import { NoBlending as NoBlending21, ShaderMaterial as ShaderMaterial21, Uniform as Uniform22, Vector2 as Vector214 } from "three";

// src/materials/glsl/convolution.upsampling.frag
var convolution_upsampling_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;\n#else\nuniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;\n#endif\nuniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);\n#include <colorspace_fragment>\n}";

// src/materials/glsl/convolution.upsampling.vert
var convolution_upsampling_default2 = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}";

// src/materials/UpsamplingMaterial.js
var UpsamplingMaterial = class extends ShaderMaterial21 {
  /**
   * Constructs a new upsampling material.
   */
  constructor() {
    super({
      name: "UpsamplingMaterial",
      uniforms: {
        inputBuffer: new Uniform22(null),
        supportBuffer: new Uniform22(null),
        texelSize: new Uniform22(new Vector214()),
        radius: new Uniform22(0.85)
      },
      blending: NoBlending21,
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
      fragmentShader: convolution_upsampling_default,
      vertexShader: convolution_upsampling_default2
    });
    this.fragmentShader = updateFragmentShader(this.fragmentShader);
  }
  /**
   * The input buffer.
   *
   * @type {Texture}
   */
  set inputBuffer(value) {
    this.uniforms.inputBuffer.value = value;
  }
  /**
   * A support buffer.
   *
   * @type {Texture}
   */
  set supportBuffer(value) {
    this.uniforms.supportBuffer.value = value;
  }
  /**
   * The blur radius.
   *
   * @type {Number}
   */
  get radius() {
    return this.uniforms.radius.value;
  }
  set radius(value) {
    this.uniforms.radius.value = value;
  }
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.uniforms.texelSize.value.set(1 / width, 1 / height);
  }
};

// src/passes/CopyPass.js
import { LinearFilter, UnsignedByteType as UnsignedByteType2, WebGLRenderTarget as WebGLRenderTarget2 } from "three";

// src/passes/Pass.js
import {
  BasicDepthPacking as BasicDepthPacking8,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Material,
  Mesh,
  Scene,
  Texture,
  WebGLRenderTarget
} from "three";
var dummyCamera = /* @__PURE__ */ new Camera();
var geometry = null;
function getFullscreenTriangle() {
  if (geometry === null) {
    const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
    geometry = new BufferGeometry();
    if (geometry.setAttribute !== void 0) {
      geometry.setAttribute("position", new BufferAttribute(vertices, 3));
      geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
    } else {
      geometry.addAttribute("position", new BufferAttribute(vertices, 3));
      geometry.addAttribute("uv", new BufferAttribute(uvs, 2));
    }
  }
  return geometry;
}
var Pass = class _Pass {
  /**
   * Constructs a new pass.
   *
   * @param {String} [name] - The name of this pass. Does not have to be unique.
   * @param {Scene} [scene] - The scene to render. The default scene contains a single mesh that fills the screen.
   * @param {Camera} [camera] - A camera. Fullscreen effect passes don't require a camera.
   */
  constructor(name = "Pass", scene = new Scene(), camera = dummyCamera) {
    this.name = name;
    this.renderer = null;
    this.scene = scene;
    this.camera = camera;
    this.screen = null;
    this.rtt = true;
    this.needsSwap = true;
    this.needsDepthTexture = false;
    this.enabled = true;
  }
  /**
   * Sets the render to screen flag.
   *
   * If this flag is changed, the fullscreen material will be updated as well.
   *
   * @type {Boolean}
   */
  get renderToScreen() {
    return !this.rtt;
  }
  set renderToScreen(value) {
    if (this.rtt === value) {
      const material = this.fullscreenMaterial;
      if (material !== null) {
        material.needsUpdate = true;
      }
      this.rtt = !value;
    }
  }
  /**
   * Sets the main scene.
   *
   * @type {Scene}
   */
  set mainScene(value) {
  }
  /**
   * Sets the main camera.
   *
   * @type {Camera}
   */
  set mainCamera(value) {
  }
  /**
   * Sets the renderer
   *
   * @deprecated
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
  }
  /**
   * Indicates whether this pass is enabled.
   *
   * @deprecated Use enabled instead.
   * @return {Boolean} Whether this pass is enabled.
   */
  isEnabled() {
    return this.enabled;
  }
  /**
   * Enables or disables this pass.
   *
   * @deprecated Use enabled instead.
   * @param {Boolean} value - Whether the pass should be enabled.
   */
  setEnabled(value) {
    this.enabled = value;
  }
  /**
   * The fullscreen material.
   *
   * @type {Material}
   */
  get fullscreenMaterial() {
    return this.screen !== null ? this.screen.material : null;
  }
  set fullscreenMaterial(value) {
    let screen = this.screen;
    if (screen !== null) {
      screen.material = value;
    } else {
      screen = new Mesh(getFullscreenTriangle(), value);
      screen.frustumCulled = false;
      if (this.scene === null) {
        this.scene = new Scene();
      }
      this.scene.add(screen);
      this.screen = screen;
    }
  }
  /**
   * Returns the current fullscreen material.
   *
   * @deprecated Use fullscreenMaterial instead.
   * @return {Material} The current fullscreen material, or null if there is none.
   */
  getFullscreenMaterial() {
    return this.fullscreenMaterial;
  }
  /**
   * Sets the fullscreen material.
   *
   * @deprecated Use fullscreenMaterial instead.
   * @protected
   * @param {Material} value - A fullscreen material.
   */
  setFullscreenMaterial(value) {
    this.fullscreenMaterial = value;
  }
  /**
   * Returns the current depth texture.
   *
   * @return {Texture} The current depth texture, or null if there is none.
   */
  getDepthTexture() {
    return null;
  }
  /**
   * Sets the depth texture.
   *
   * This method will be called automatically by the {@link EffectComposer}.
   * You may override this method if your pass relies on the depth information of a preceding {@link RenderPass}.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategy} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking8) {
  }
  /**
   * Renders this pass.
   *
   * This is an abstract method that must be overridden.
   *
   * @abstract
   * @throws {Error} An error is thrown if the method is not overridden.
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    throw new Error("Render method not implemented!");
  }
  /**
   * Sets the size.
   *
   * You may override this method if you want to be informed about the size of the backbuffer/canvas.
   * This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
  }
  /**
   * Performs initialization tasks.
   *
   * This method is called when this pass is added to an {@link EffectComposer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
  }
  /**
   * Performs a shallow search for disposable properties and deletes them.
   *
   * The {@link EffectComposer} calls this method when it is being destroyed. You can use it independently to free
   * memory when you're certain that you don't need this pass anymore.
   */
  dispose() {
    for (const key of Object.keys(this)) {
      const property = this[key];
      const isDisposable = property instanceof WebGLRenderTarget || property instanceof Material || property instanceof Texture || property instanceof _Pass;
      if (isDisposable) {
        this[key].dispose();
      }
    }
  }
};

// src/passes/CopyPass.js
var CopyPass = class extends Pass {
  /**
   * Constructs a new save pass.
   *
   * @param {WebGLRenderTarget} [renderTarget] - A render target.
   * @param {Boolean} [autoResize=true] - Whether the render target size should be updated automatically.
   */
  constructor(renderTarget, autoResize = true) {
    super("CopyPass");
    this.fullscreenMaterial = new CopyMaterial();
    this.needsSwap = false;
    this.renderTarget = renderTarget;
    if (renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget2(1, 1, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        stencilBuffer: false,
        depthBuffer: false
      });
      this.renderTarget.texture.name = "CopyPass.Target";
    }
    this.autoResize = autoResize;
  }
  /**
   * Enables or disables auto resizing of the render target.
   *
   * @deprecated Use autoResize instead.
   * @type {Boolean}
   */
  get resize() {
    return this.autoResize;
  }
  set resize(value) {
    this.autoResize = value;
  }
  /**
   * The output texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the output texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Enables or disables auto resizing of the render target.
   *
   * @deprecated Use autoResize instead.
   * @param {Boolean} value - Whether the render target size should be updated automatically.
   */
  setAutoResizeEnabled(value) {
    this.autoResize = value;
  }
  /**
   * Saves the input buffer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.fullscreenMaterial.inputBuffer = inputBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    if (this.autoResize) {
      this.renderTarget.setSize(width, height);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType2) {
        this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTarget.texture, SRGBColorSpace);
      }
    }
  }
};

// src/passes/AdaptiveLuminancePass.js
var AdaptiveLuminancePass = class extends Pass {
  /**
   * Constructs a new adaptive luminance pass.
   *
   * @param {Texture} luminanceBuffer - A buffer that contains the current scene luminance.
   * @param {Object} [options] - The options.
   * @param {Number} [options.minLuminance=0.01] - The minimum luminance.
   * @param {Number} [options.adaptationRate=1.0] - The luminance adaptation rate.
   */
  constructor(luminanceBuffer, { minLuminance = 0.01, adaptationRate = 1 } = {}) {
    super("AdaptiveLuminancePass");
    this.fullscreenMaterial = new AdaptiveLuminanceMaterial();
    this.needsSwap = false;
    this.renderTargetPrevious = new WebGLRenderTarget3(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false
    });
    this.renderTargetPrevious.texture.name = "Luminance.Previous";
    const material = this.fullscreenMaterial;
    material.luminanceBuffer0 = this.renderTargetPrevious.texture;
    material.luminanceBuffer1 = luminanceBuffer;
    material.minLuminance = minLuminance;
    material.adaptationRate = adaptationRate;
    this.renderTargetAdapted = this.renderTargetPrevious.clone();
    this.renderTargetAdapted.texture.name = "Luminance.Adapted";
    this.copyPass = new CopyPass(this.renderTargetPrevious, false);
  }
  /**
   * The adaptive luminance texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTargetAdapted.texture;
  }
  /**
   * Returns the adaptive 1x1 luminance texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTargetAdapted.texture;
  }
  /**
   * Sets the 1x1 mipmap level.
   *
   * This level is used to identify the smallest mipmap of the main luminance texture which contains the downsampled
   * average scene luminance.
   *
   * @type {Number}
   * @deprecated Use fullscreenMaterial.mipLevel1x1 instead.
   */
  set mipLevel1x1(value) {
    this.fullscreenMaterial.mipLevel1x1 = value;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   * @deprecated Use fullscreenMaterial.adaptationRate instead.
   */
  get adaptationRate() {
    return this.fullscreenMaterial.adaptationRate;
  }
  /**
   * @type {Number}
   * @deprecated Use fullscreenMaterial.adaptationRate instead.
   */
  set adaptationRate(value) {
    this.fullscreenMaterial.adaptationRate = value;
  }
  /**
   * Renders the scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.fullscreenMaterial.deltaTime = deltaTime;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTargetAdapted);
    renderer.render(this.scene, this.camera);
    this.copyPass.render(renderer, this.renderTargetAdapted);
  }
};

// src/passes/BoxBlurPass.js
import { BasicDepthPacking as BasicDepthPacking9, UnsignedByteType as UnsignedByteType3, WebGLRenderTarget as WebGLRenderTarget4 } from "three";
var BoxBlurPass = class extends Pass {
  /**
   * Constructs a new box blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.kernelSize=5] - Must be an odd number. The sizes 3 and 5 use optimized code paths.
   * @param {Number} [options.iterations=1] - The amount of times the blur should be applied.
   * @param {Number} [options.bilateral=false] - Enables or disables bilateral blurring.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    kernelSize = 5,
    iterations = 1,
    bilateral = false,
    resolutionScale = 1,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super("BoxBlurPass");
    this.needsDepthTexture = bilateral;
    this.renderTargetA = new WebGLRenderTarget4(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "Blur.Target.A";
    this.renderTargetB = new WebGLRenderTarget4(1, 1, { depthBuffer: false });
    this.renderTargetB.texture.name = "Blur.Target.B";
    this.blurMaterial = new BoxBlurMaterial({ bilateral, kernelSize });
    this.copyMaterial = new CopyMaterial();
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.iterations = iterations;
  }
  set mainCamera(value) {
    this.blurMaterial.copyCameraSettings(value);
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking9) {
    this.blurMaterial.depthBuffer = depthTexture;
    this.blurMaterial.depthPacking = depthPacking;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetA = this.renderTargetA;
    const renderTargetB = this.renderTargetB;
    const blurMaterial = this.blurMaterial;
    this.fullscreenMaterial = blurMaterial;
    let previousBuffer = inputBuffer;
    for (let i = 0, l = Math.max(this.iterations, 1); i < l; ++i) {
      const buffer = (i & 1) === 0 ? renderTargetA : renderTargetB;
      blurMaterial.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(buffer);
      renderer.render(scene, camera);
      previousBuffer = buffer;
    }
    this.copyMaterial.inputBuffer = previousBuffer.texture;
    this.fullscreenMaterial = this.copyMaterial;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w, h);
    this.renderTargetB.setSize(w, h);
    this.blurMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurMaterial.maxVaryingVectors = renderer.capabilities.maxVaryings;
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType3) {
        this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTargetA.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetB.texture, SRGBColorSpace);
      }
    }
  }
};

// src/passes/ClearMaskPass.js
var ClearMaskPass = class extends Pass {
  /**
   * Constructs a new clear mask pass.
   */
  constructor() {
    super("ClearMaskPass", null, null);
    this.needsSwap = false;
  }
  /**
   * Disables the global stencil test.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const stencil = renderer.state.buffers.stencil;
    stencil.setLocked(false);
    stencil.setTest(false);
  }
};

// src/passes/ClearPass.js
import { Color } from "three";
var color = /* @__PURE__ */ new Color();
var ClearPass = class extends Pass {
  /**
   * Constructs a new clear pass.
   *
   * @param {Boolean} [color=true] - Determines whether the color buffer should be cleared.
   * @param {Boolean} [depth=true] - Determines whether the depth buffer should be cleared.
   * @param {Boolean} [stencil=false] - Determines whether the stencil buffer should be cleared.
   */
  constructor(color2 = true, depth = true, stencil = false) {
    super("ClearPass", null, null);
    this.needsSwap = false;
    this.color = color2;
    this.depth = depth;
    this.stencil = stencil;
    this.overrideClearColor = null;
    this.overrideClearAlpha = -1;
  }
  /**
   * Sets the clear flags.
   *
   * @param {Boolean} color - Whether the color buffer should be cleared.
   * @param {Boolean} depth - Whether the depth buffer should be cleared.
   * @param {Boolean} stencil - Whether the stencil buffer should be cleared.
   */
  setClearFlags(color2, depth, stencil) {
    this.color = color2;
    this.depth = depth;
    this.stencil = stencil;
  }
  /**
   * Returns the override clear color. Default is null.
   *
   * @deprecated Use overrideClearColor instead.
   * @return {Color} The clear color.
   */
  getOverrideClearColor() {
    return this.overrideClearColor;
  }
  /**
   * Sets the override clear color.
   *
   * @deprecated Use overrideClearColor instead.
   * @param {Color} value - The clear color.
   */
  setOverrideClearColor(value) {
    this.overrideClearColor = value;
  }
  /**
   * Returns the override clear alpha. Default is -1.
   *
   * @deprecated Use overrideClearAlpha instead.
   * @return {Number} The clear alpha.
   */
  getOverrideClearAlpha() {
    return this.overrideClearAlpha;
  }
  /**
   * Sets the override clear alpha.
   *
   * @deprecated Use overrideClearAlpha instead.
   * @param {Number} value - The clear alpha.
   */
  setOverrideClearAlpha(value) {
    this.overrideClearAlpha = value;
  }
  /**
   * Clears the input buffer or the screen.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const overrideClearColor = this.overrideClearColor;
    const overrideClearAlpha = this.overrideClearAlpha;
    const clearAlpha = renderer.getClearAlpha();
    const hasOverrideClearColor = overrideClearColor !== null;
    const hasOverrideClearAlpha = overrideClearAlpha >= 0;
    if (hasOverrideClearColor) {
      renderer.getClearColor(color);
      renderer.setClearColor(overrideClearColor, hasOverrideClearAlpha ? overrideClearAlpha : clearAlpha);
    } else if (hasOverrideClearAlpha) {
      renderer.setClearAlpha(overrideClearAlpha);
    }
    renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
    renderer.clear(this.color, this.depth, this.stencil);
    if (hasOverrideClearColor) {
      renderer.setClearColor(color, clearAlpha);
    } else if (hasOverrideClearAlpha) {
      renderer.setClearAlpha(clearAlpha);
    }
  }
};

// src/passes/DepthPass.js
import { Color as Color2, MeshDepthMaterial, NearestFilter as NearestFilter2, RGBADepthPacking as RGBADepthPacking2, WebGLRenderTarget as WebGLRenderTarget5 } from "three";

// src/passes/RenderPass.js
var RenderPass = class extends Pass {
  /**
   * Constructs a new render pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Material} [overrideMaterial=null] - An override material.
   */
  constructor(scene, camera, overrideMaterial = null) {
    super("RenderPass", scene, camera);
    this.needsSwap = false;
    this.clearPass = new ClearPass();
    this.overrideMaterialManager = overrideMaterial === null ? null : new OverrideMaterialManager(overrideMaterial);
    this.ignoreBackground = false;
    this.skipShadowMapUpdate = false;
    this.selection = null;
  }
  set mainScene(value) {
    this.scene = value;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  get renderToScreen() {
    return super.renderToScreen;
  }
  set renderToScreen(value) {
    super.renderToScreen = value;
    this.clearPass.renderToScreen = value;
  }
  /**
   * The current override material.
   *
   * @type {Material}
   */
  get overrideMaterial() {
    const manager = this.overrideMaterialManager;
    return manager !== null ? manager.material : null;
  }
  set overrideMaterial(value) {
    const manager = this.overrideMaterialManager;
    if (value !== null) {
      if (manager !== null) {
        manager.setMaterial(value);
      } else {
        this.overrideMaterialManager = new OverrideMaterialManager(value);
      }
    } else if (manager !== null) {
      manager.dispose();
      this.overrideMaterialManager = null;
    }
  }
  /**
   * Returns the current override material.
   *
   * @deprecated Use overrideMaterial instead.
   * @return {Material} The material.
   */
  getOverrideMaterial() {
    return this.overrideMaterial;
  }
  /**
   * Sets the override material.
   *
   * @deprecated Use overrideMaterial instead.
   * @return {Material} value - The material.
   */
  setOverrideMaterial(value) {
    this.overrideMaterial = value;
  }
  /**
   * Indicates whether the target buffer should be cleared before rendering.
   *
   * @type {Boolean}
   * @deprecated Use clearPass.enabled instead.
   */
  get clear() {
    return this.clearPass.enabled;
  }
  set clear(value) {
    this.clearPass.enabled = value;
  }
  /**
   * Returns the selection. Default is `null` (no restriction).
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * Sets the selection. Set to `null` to disable.
   *
   * @deprecated Use selection instead.
   * @param {Selection} value - The selection.
   */
  setSelection(value) {
    this.selection = value;
  }
  /**
   * Indicates whether the scene background is disabled.
   *
   * @deprecated Use ignoreBackground instead.
   * @return {Boolean} Whether the scene background is disabled.
   */
  isBackgroundDisabled() {
    return this.ignoreBackground;
  }
  /**
   * Enables or disables the scene background.
   *
   * @deprecated Use ignoreBackground instead.
   * @param {Boolean} value - Whether the scene background should be disabled.
   */
  setBackgroundDisabled(value) {
    this.ignoreBackground = value;
  }
  /**
   * Indicates whether the shadow map auto update is disabled.
   *
   * @deprecated Use skipShadowMapUpdate instead.
   * @return {Boolean} Whether the shadow map update is disabled.
   */
  isShadowMapDisabled() {
    return this.skipShadowMapUpdate;
  }
  /**
   * Enables or disables the shadow map auto update.
   *
   * @deprecated Use skipShadowMapUpdate instead.
   * @param {Boolean} value - Whether the shadow map auto update should be disabled.
   */
  setShadowMapDisabled(value) {
    this.skipShadowMapUpdate = value;
  }
  /**
   * Returns the clear pass.
   *
   * @deprecated Use clearPass.enabled instead.
   * @return {ClearPass} The clear pass.
   */
  getClearPass() {
    return this.clearPass;
  }
  /**
   * Renders the scene.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const selection = this.selection;
    const mask = camera.layers.mask;
    const background = scene.background;
    const shadowMapAutoUpdate = renderer.shadowMap.autoUpdate;
    const renderTarget = this.renderToScreen ? null : inputBuffer;
    if (selection !== null) {
      camera.layers.set(selection.getLayer());
    }
    if (this.skipShadowMapUpdate) {
      renderer.shadowMap.autoUpdate = false;
    }
    if (this.ignoreBackground || this.clearPass.overrideClearColor !== null) {
      scene.background = null;
    }
    if (this.clearPass.enabled) {
      this.clearPass.render(renderer, inputBuffer);
    }
    renderer.setRenderTarget(renderTarget);
    if (this.overrideMaterialManager !== null) {
      this.overrideMaterialManager.render(renderer, scene, camera);
    } else {
      renderer.render(scene, camera);
    }
    camera.layers.mask = mask;
    scene.background = background;
    renderer.shadowMap.autoUpdate = shadowMapAutoUpdate;
  }
};

// src/passes/DepthPass.js
var DepthPass = class extends Pass {
  /**
   * Constructs a new depth pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Object} [options] - The options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    renderTarget,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthPass");
    this.needsSwap = false;
    this.renderPass = new RenderPass(scene, camera, new MeshDepthMaterial({
      depthPacking: RGBADepthPacking2
    }));
    const renderPass = this.renderPass;
    renderPass.skipShadowMapUpdate = true;
    renderPass.ignoreBackground = true;
    const clearPass = renderPass.clearPass;
    clearPass.overrideClearColor = new Color2(16777215);
    clearPass.overrideClearAlpha = 1;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget5(1, 1, {
        minFilter: NearestFilter2,
        magFilter: NearestFilter2
      });
      this.renderTarget.texture.name = "DepthPass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainScene(value) {
    this.renderPass.mainScene = value;
  }
  set mainCamera(value) {
    this.renderPass.mainCamera = value;
  }
  /**
   * The depth texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the depth texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * Renders the scene depth.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const renderTarget = this.renderToScreen ? null : this.renderTarget;
    this.renderPass.render(renderer, renderTarget);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
};

// src/passes/DepthDownsamplingPass.js
import { BasicDepthPacking as BasicDepthPacking10, FloatType, NearestFilter as NearestFilter3, WebGLRenderTarget as WebGLRenderTarget6 } from "three";
var DepthDownsamplingPass = class extends Pass {
  /**
   * Constructs a new depth downsampling pass.
   *
   * @param {Object} [options] - The options.
   * @param {Texture} [options.normalBuffer=null] - A texture that contains view space normals. See {@link NormalPass}.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    normalBuffer = null,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthDownsamplingPass");
    const material = new DepthDownsamplingMaterial();
    material.normalBuffer = normalBuffer;
    this.fullscreenMaterial = material;
    this.needsDepthTexture = true;
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget6(1, 1, {
      minFilter: NearestFilter3,
      magFilter: NearestFilter3,
      depthBuffer: false,
      type: FloatType
    });
    this.renderTarget.texture.name = "DepthDownsamplingPass.Target";
    this.renderTarget.texture.generateMipmaps = false;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * The normal(RGB) + depth(A) texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the normal(RGB) + depth(A) texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking10) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.depthPacking = depthPacking;
  }
  /**
   * Downsamples depth and scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.fullscreenMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    const gl = renderer.getContext();
    const renderable = gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float");
    if (!renderable) {
      throw new Error("Rendering to float texture is not supported.");
    }
  }
};

// src/passes/DepthPickingPass.js
import { FloatType as FloatType3, RGBADepthPacking as RGBADepthPacking4 } from "three";

// src/passes/DepthCopyPass.js
import {
  BasicDepthPacking as BasicDepthPacking11,
  FloatType as FloatType2,
  NearestFilter as NearestFilter4,
  RGBADepthPacking as RGBADepthPacking3,
  UnsignedByteType as UnsignedByteType4,
  WebGLRenderTarget as WebGLRenderTarget7
} from "three";
var DepthCopyPass = class extends Pass {
  /**
   * Constructs a new depth save pass.
   *
   * @param {Object} [options] - The options.
   * @param {DepthPackingStrategies} [options.depthPacking=RGBADepthPacking] - The output depth packing.
   */
  constructor({ depthPacking = RGBADepthPacking3 } = {}) {
    super("DepthCopyPass");
    const material = new DepthCopyMaterial();
    material.outputDepthPacking = depthPacking;
    this.fullscreenMaterial = material;
    this.needsDepthTexture = true;
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget7(1, 1, {
      type: depthPacking === RGBADepthPacking3 ? UnsignedByteType4 : FloatType2,
      minFilter: NearestFilter4,
      magFilter: NearestFilter4,
      depthBuffer: false
    });
    this.renderTarget.texture.name = "DepthCopyPass.Target";
  }
  /**
   * The output depth texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the output depth texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * The output depth packing.
   *
   * @type {DepthPackingStrategies}
   */
  get depthPacking() {
    return this.fullscreenMaterial.outputDepthPacking;
  }
  /**
   * Returns the output depth packing.
   *
   * @deprecated Use depthPacking instead.
   * @return {DepthPackingStrategies} The depth packing.
   */
  getDepthPacking() {
    return this.fullscreenMaterial.outputDepthPacking;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking11) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.inputDepthPacking = depthPacking;
  }
  /**
   * Copies depth from a depth texture.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.renderTarget.setSize(width, height);
  }
};

// src/passes/DepthPickingPass.js
var unpackFactors = new Float32Array([
  255 / 256 / 256 ** 3,
  255 / 256 / 256 ** 2,
  255 / 256 / 256,
  255 / 256
]);
function unpackRGBAToDepth(packedDepth) {
  return (packedDepth[0] * unpackFactors[0] + packedDepth[1] * unpackFactors[1] + packedDepth[2] * unpackFactors[2] + packedDepth[3] * unpackFactors[3]) / 255;
}
var DepthPickingPass = class extends DepthCopyPass {
  /**
   * Constructs a new depth picking pass.
   *
   * @param {Object} [options] - The options.
   * @param {DepthPackingStrategies} [options.depthPacking=RGBADepthPacking] - The depth packing.
   * @param {Number} [options.mode=DepthCopyMode.SINGLE] - The depth copy mode.
   */
  constructor({ depthPacking = RGBADepthPacking4, mode = DepthCopyMode.SINGLE } = {}) {
    super({ depthPacking });
    this.name = "DepthPickingPass";
    this.fullscreenMaterial.mode = mode;
    this.pixelBuffer = depthPacking === RGBADepthPacking4 ? new Uint8Array(4) : new Float32Array(4);
    this.callback = null;
  }
  /**
   * Reads depth at a specific screen position.
   *
   * Only one depth value can be picked per frame. Calling this method multiple times per frame will overwrite the
   * picking coordinates. Unresolved promises will be abandoned.
   *
   * @example
   * const ndc = new Vector3();
   * const clientRect = myViewport.getBoundingClientRect();
   * const clientX = pointerEvent.clientX - clientRect.left;
   * const clientY = pointerEvent.clientY - clientRect.top;
   * ndc.x = (clientX / myViewport.clientWidth) * 2.0 - 1.0;
   * ndc.y = -(clientY / myViewport.clientHeight) * 2.0 + 1.0;
   * const depth = await depthPickingPass.readDepth(ndc);
   * ndc.z = depth * 2.0 - 1.0;
   *
   * const worldPosition = ndc.unproject(camera);
   *
   * @param {Vector2|Vector3} ndc - Normalized device coordinates. Only X and Y are relevant.
   * @return {Promise<Number>} A promise that returns the depth on the next frame.
   */
  readDepth(ndc) {
    this.fullscreenMaterial.texelPosition.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5);
    return new Promise((resolve) => {
      this.callback = resolve;
    });
  }
  /**
   * Copies depth and resolves depth picking promises.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const material = this.fullscreenMaterial;
    const mode = material.mode;
    if (mode === DepthCopyMode.FULL) {
      super.render(renderer);
    }
    if (this.callback !== null) {
      const renderTarget = this.renderTarget;
      const pixelBuffer = this.pixelBuffer;
      const packed = renderTarget.texture.type !== FloatType3;
      let x = 0, y = 0;
      if (mode === DepthCopyMode.SINGLE) {
        super.render(renderer);
      } else {
        const texelPosition = material.texelPosition;
        x = Math.round(texelPosition.x * renderTarget.width);
        y = Math.round(texelPosition.y * renderTarget.height);
      }
      renderer.readRenderTargetPixels(renderTarget, x, y, 1, 1, pixelBuffer);
      this.callback(packed ? unpackRGBAToDepth(pixelBuffer) : pixelBuffer[0]);
      this.callback = null;
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    if (this.fullscreenMaterial.mode === DepthCopyMode.FULL) {
      super.setSize(width, height);
    }
  }
};

// src/passes/EffectPass.js
import { BasicDepthPacking as BasicDepthPacking12, UnsignedByteType as UnsignedByteType5 } from "three";
function prefixSubstrings(prefix, substrings, strings) {
  for (const substring of substrings) {
    const prefixed = "$1" + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
    const regExp = new RegExp("([^\\.])(\\b" + substring + "\\b)", "g");
    for (const entry of strings.entries()) {
      if (entry[1] !== null) {
        strings.set(entry[0], entry[1].replace(regExp, prefixed));
      }
    }
  }
}
function integrateEffect(prefix, effect, data) {
  let fragmentShader = effect.getFragmentShader();
  let vertexShader = effect.getVertexShader();
  const mainImageExists = fragmentShader !== void 0 && /mainImage/.test(fragmentShader);
  const mainUvExists = fragmentShader !== void 0 && /mainUv/.test(fragmentShader);
  data.attributes |= effect.getAttributes();
  if (fragmentShader === void 0) {
    throw new Error(`Missing fragment shader (${effect.name})`);
  } else if (mainUvExists && (data.attributes & EffectAttribute.CONVOLUTION) !== 0) {
    throw new Error(`Effects that transform UVs are incompatible with convolution effects (${effect.name})`);
  } else if (!mainImageExists && !mainUvExists) {
    throw new Error(`Could not find mainImage or mainUv function (${effect.name})`);
  } else {
    const functionRegExp = /\w+\s+(\w+)\([\w\s,]*\)\s*{/g;
    const shaderParts = data.shaderParts;
    let fragmentHead = shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "";
    let fragmentMainUv = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "";
    let fragmentMainImage = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "";
    let vertexHead = shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "";
    let vertexMainSupport = shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "";
    const varyings = /* @__PURE__ */ new Set();
    const names = /* @__PURE__ */ new Set();
    if (mainUvExists) {
      fragmentMainUv += `	${prefix}MainUv(UV);
`;
      data.uvTransformation = true;
    }
    if (vertexShader !== null && /mainSupport/.test(vertexShader)) {
      const needsUv = /mainSupport *\([\w\s]*?uv\s*?\)/.test(vertexShader);
      vertexMainSupport += `	${prefix}MainSupport(`;
      vertexMainSupport += needsUv ? "vUv);\n" : ");\n";
      for (const m2 of vertexShader.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g)) {
        for (const n of m2[1].split(/\s*,\s*/)) {
          data.varyings.add(n);
          varyings.add(n);
          names.add(n);
        }
      }
      for (const m2 of vertexShader.matchAll(functionRegExp)) {
        names.add(m2[1]);
      }
    }
    for (const m2 of fragmentShader.matchAll(functionRegExp)) {
      names.add(m2[1]);
    }
    for (const d of effect.defines.keys()) {
      names.add(d.replace(/\([\w\s,]*\)/g, ""));
    }
    for (const u of effect.uniforms.keys()) {
      names.add(u);
    }
    names.delete("while");
    names.delete("for");
    names.delete("if");
    effect.uniforms.forEach((val, key) => data.uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
    effect.defines.forEach((val, key) => data.defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
    const shaders = /* @__PURE__ */ new Map([["fragment", fragmentShader], ["vertex", vertexShader]]);
    prefixSubstrings(prefix, names, data.defines);
    prefixSubstrings(prefix, names, shaders);
    fragmentShader = shaders.get("fragment");
    vertexShader = shaders.get("vertex");
    const blendMode = effect.blendMode;
    data.blendModes.set(blendMode.blendFunction, blendMode);
    if (mainImageExists) {
      if (effect.inputColorSpace !== null && effect.inputColorSpace !== data.colorSpace) {
        fragmentMainImage += effect.inputColorSpace === SRGBColorSpace ? "color0 = LinearTosRGB(color0);\n	" : "color0 = sRGBToLinear(color0);\n	";
      }
      if (effect.outputColorSpace !== NoColorSpace) {
        data.colorSpace = effect.outputColorSpace;
      } else if (effect.inputColorSpace !== null) {
        data.colorSpace = effect.inputColorSpace;
      }
      const depthParamRegExp = /MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;
      fragmentMainImage += `${prefix}MainImage(color0, UV, `;
      if ((data.attributes & EffectAttribute.DEPTH) !== 0 && depthParamRegExp.test(fragmentShader)) {
        fragmentMainImage += "depth, ";
        data.readDepth = true;
      }
      fragmentMainImage += "color1);\n	";
      const blendOpacity = prefix + "BlendOpacity";
      data.uniforms.set(blendOpacity, blendMode.opacity);
      fragmentMainImage += `color0 = blend${blendMode.blendFunction}(color0, color1, ${blendOpacity});

	`;
      fragmentHead += `uniform float ${blendOpacity};

`;
    }
    fragmentHead += fragmentShader + "\n";
    if (vertexShader !== null) {
      vertexHead += vertexShader + "\n";
    }
    shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
    shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
    shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
    shaderParts.set(EffectShaderSection.VERTEX_HEAD, vertexHead);
    shaderParts.set(EffectShaderSection.VERTEX_MAIN_SUPPORT, vertexMainSupport);
    if (effect.extensions !== null) {
      for (const extension of effect.extensions) {
        data.extensions.add(extension);
      }
    }
  }
}
var EffectPass = class extends Pass {
  /**
   * Constructs a new effect pass.
   *
   * @param {Camera} camera - The main camera.
   * @param {...Effect} effects - The effects that will be rendered by this pass.
   */
  constructor(camera, ...effects) {
    super("EffectPass");
    this.fullscreenMaterial = new EffectMaterial(null, null, null, camera);
    this.listener = (event) => this.handleEvent(event);
    this.effects = [];
    this.setEffects(effects);
    this.skipRendering = false;
    this.minTime = 1;
    this.maxTime = Number.POSITIVE_INFINITY;
    this.timeScale = 1;
  }
  set mainScene(value) {
    for (const effect of this.effects) {
      effect.mainScene = value;
    }
  }
  set mainCamera(value) {
    this.fullscreenMaterial.copyCameraSettings(value);
    for (const effect of this.effects) {
      effect.mainCamera = value;
    }
  }
  /**
   * Indicates whether this pass encodes its output when rendering to screen.
   *
   * @type {Boolean}
   * @deprecated Use fullscreenMaterial.encodeOutput instead.
   */
  get encodeOutput() {
    return this.fullscreenMaterial.encodeOutput;
  }
  set encodeOutput(value) {
    this.fullscreenMaterial.encodeOutput = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   */
  get dithering() {
    return this.fullscreenMaterial.dithering;
  }
  set dithering(value) {
    const material = this.fullscreenMaterial;
    material.dithering = value;
    material.needsUpdate = true;
  }
  /**
   * Sets the effects.
   *
   * @param {Effect[]} effects - The effects.
   * @protected
   */
  setEffects(effects) {
    for (const effect of this.effects) {
      effect.removeEventListener("change", this.listener);
    }
    this.effects = effects.sort((a, b) => b.attributes - a.attributes);
    for (const effect of this.effects) {
      effect.addEventListener("change", this.listener);
    }
  }
  /**
   * Updates the compound shader material.
   *
   * @protected
   */
  updateMaterial() {
    const data = new EffectShaderData();
    let id = 0;
    for (const effect of this.effects) {
      if (effect.blendMode.blendFunction === BlendFunction.DST) {
        data.attributes |= effect.getAttributes() & EffectAttribute.DEPTH;
      } else if ((data.attributes & effect.getAttributes() & EffectAttribute.CONVOLUTION) !== 0) {
        throw new Error(`Convolution effects cannot be merged (${effect.name})`);
      } else {
        integrateEffect("e" + id++, effect, data);
      }
    }
    let fragmentHead = data.shaderParts.get(EffectShaderSection.FRAGMENT_HEAD);
    let fragmentMainImage = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE);
    let fragmentMainUv = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV);
    const blendRegExp = /\bblend\b/g;
    for (const blendMode of data.blendModes.values()) {
      fragmentHead += blendMode.getShaderCode().replace(blendRegExp, `blend${blendMode.blendFunction}`) + "\n";
    }
    if ((data.attributes & EffectAttribute.DEPTH) !== 0) {
      if (data.readDepth) {
        fragmentMainImage = "float depth = readDepth(UV);\n\n	" + fragmentMainImage;
      }
      this.needsDepthTexture = this.getDepthTexture() === null;
    } else {
      this.needsDepthTexture = false;
    }
    if (data.colorSpace === SRGBColorSpace) {
      fragmentMainImage += "color0 = sRGBToLinear(color0);\n	";
    }
    if (data.uvTransformation) {
      fragmentMainUv = "vec2 transformedUv = vUv;\n" + fragmentMainUv;
      data.defines.set("UV", "transformedUv");
    } else {
      data.defines.set("UV", "vUv");
    }
    data.shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
    data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
    data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
    for (const [key, value] of data.shaderParts) {
      if (value !== null) {
        data.shaderParts.set(key, value.trim().replace(/^#/, "\n#"));
      }
    }
    this.skipRendering = id === 0;
    this.needsSwap = !this.skipRendering;
    this.fullscreenMaterial.setShaderData(data);
  }
  /**
   * Rebuilds the shader material.
   */
  recompile() {
    this.updateMaterial();
  }
  /**
   * Returns the current depth texture.
   *
   * @return {Texture} The current depth texture, or null if there is none.
   */
  getDepthTexture() {
    return this.fullscreenMaterial.depthBuffer;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking12) {
    this.fullscreenMaterial.depthBuffer = depthTexture;
    this.fullscreenMaterial.depthPacking = depthPacking;
    for (const effect of this.effects) {
      effect.setDepthTexture(depthTexture, depthPacking);
    }
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    for (const effect of this.effects) {
      effect.update(renderer, inputBuffer, deltaTime);
    }
    if (!this.skipRendering || this.renderToScreen) {
      const material = this.fullscreenMaterial;
      material.inputBuffer = inputBuffer.texture;
      material.time += deltaTime * this.timeScale;
      renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
      renderer.render(this.scene, this.camera);
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.fullscreenMaterial.setSize(width, height);
    for (const effect of this.effects) {
      effect.setSize(width, height);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.renderer = renderer;
    for (const effect of this.effects) {
      effect.initialize(renderer, alpha, frameBufferType);
    }
    this.updateMaterial();
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType5) {
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
  /**
   * Deletes disposable objects.
   */
  dispose() {
    super.dispose();
    for (const effect of this.effects) {
      effect.removeEventListener("change", this.listener);
      effect.dispose();
    }
  }
  /**
   * Handles events.
   *
   * @param {Event} event - An event.
   */
  handleEvent(event) {
    switch (event.type) {
      case "change":
        this.recompile();
        break;
    }
  }
};

// src/passes/GaussianBlurPass.js
import { UnsignedByteType as UnsignedByteType6, WebGLRenderTarget as WebGLRenderTarget8 } from "three";
var GaussianBlurPass = class extends Pass {
  /**
   * Constructs a new Gaussian blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.kernelSize=35] - The kernel size. Should be an odd number in the range [3, 1020].
   * @param {Number} [options.iterations=1] - The amount of times the blur should be applied.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    kernelSize = 35,
    iterations = 1,
    resolutionScale = 1,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super("GaussianBlurPass");
    this.renderTargetA = new WebGLRenderTarget8(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "Blur.Target.A";
    this.renderTargetB = this.renderTargetA.clone();
    this.renderTargetB.texture.name = "Blur.Target.B";
    this.blurMaterial = new GaussianBlurMaterial({ kernelSize });
    this.copyMaterial = new CopyMaterial();
    this.copyMaterial.inputBuffer = this.renderTargetB.texture;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.iterations = iterations;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetA = this.renderTargetA;
    const renderTargetB = this.renderTargetB;
    const blurMaterial = this.blurMaterial;
    this.fullscreenMaterial = blurMaterial;
    let previousBuffer = inputBuffer;
    for (let i = 0, l = Math.max(this.iterations, 1); i < l; ++i) {
      blurMaterial.direction.set(1, 0);
      blurMaterial.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(renderTargetA);
      renderer.render(scene, camera);
      blurMaterial.direction.set(0, 1);
      blurMaterial.inputBuffer = renderTargetA.texture;
      renderer.setRenderTarget(renderTargetB);
      renderer.render(scene, camera);
      if (i === 0 && l > 1) {
        previousBuffer = renderTargetB;
      }
    }
    this.fullscreenMaterial = this.copyMaterial;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w, h);
    this.renderTargetB.setSize(w, h);
    this.blurMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType6) {
        this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
        this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTargetA.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetB.texture, SRGBColorSpace);
      }
    }
  }
};

// src/passes/KawaseBlurPass.js
import { UnsignedByteType as UnsignedByteType7, WebGLRenderTarget as WebGLRenderTarget9 } from "three";
var KawaseBlurPass = class extends Pass {
  /**
   * Constructs a new Kawase blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("KawaseBlurPass");
    this.renderTargetA = new WebGLRenderTarget9(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "Blur.Target.A";
    this.renderTargetB = this.renderTargetA.clone();
    this.renderTargetB.texture.name = "Blur.Target.B";
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this._blurMaterial = new KawaseBlurMaterial();
    this._blurMaterial.kernelSize = kernelSize;
    this.copyMaterial = new CopyMaterial();
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The blur material.
   *
   * @type {KawaseBlurMaterial}
   */
  get blurMaterial() {
    return this._blurMaterial;
  }
  /**
   * The blur material.
   *
   * @type {KawaseBlurMaterial}
   * @protected
   */
  set blurMaterial(value) {
    this._blurMaterial = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated Use copyMaterial.dithering instead.
   */
  get dithering() {
    return this.copyMaterial.dithering;
  }
  set dithering(value) {
    this.copyMaterial.dithering = value;
  }
  /**
   * The kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurMaterial.kernelSize instead.
   */
  get kernelSize() {
    return this.blurMaterial.kernelSize;
  }
  set kernelSize(value) {
    this.blurMaterial.kernelSize = value;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  /**
   * Sets the render width.
   *
   * @type {Number}
   * @deprecated Use resolution.preferredWidth instead.
   */
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  /**
   * Sets the render height.
   *
   * @type {Number}
   * @deprecated Use resolution.preferredHeight instead.
   */
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * The current blur scale.
   *
   * @type {Number}
   * @deprecated Use blurMaterial.scale instead.
   */
  get scale() {
    return this.blurMaterial.scale;
  }
  set scale(value) {
    this.blurMaterial.scale = value;
  }
  /**
   * Returns the current blur scale.
   *
   * @deprecated Use blurMaterial.scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.blurMaterial.scale;
  }
  /**
   * Sets the blur scale.
   *
   * @deprecated Use blurMaterial.scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.blurMaterial.scale = value;
  }
  /**
   * Returns the kernel size.
   *
   * @deprecated Use blurMaterial.kernelSize instead.
   * @return {KernelSize} The kernel size.
   */
  getKernelSize() {
    return this.kernelSize;
  }
  /**
   * Sets the kernel size.
   *
   * Larger kernels require more processing power but scale well with larger render resolutions.
   *
   * @deprecated Use blurMaterial.kernelSize instead.
   * @param {KernelSize} value - The kernel size.
   */
  setKernelSize(value) {
    this.kernelSize = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetA = this.renderTargetA;
    const renderTargetB = this.renderTargetB;
    const material = this.blurMaterial;
    const kernelSequence = material.kernelSequence;
    let previousBuffer = inputBuffer;
    this.fullscreenMaterial = material;
    for (let i = 0, l = kernelSequence.length; i < l; ++i) {
      const buffer = (i & 1) === 0 ? renderTargetA : renderTargetB;
      material.kernel = kernelSequence[i];
      material.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(buffer);
      renderer.render(scene, camera);
      previousBuffer = buffer;
    }
    this.fullscreenMaterial = this.copyMaterial;
    this.copyMaterial.inputBuffer = previousBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w, h);
    this.renderTargetB.setSize(w, h);
    this.blurMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      if (frameBufferType !== UnsignedByteType7) {
        this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
        this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTargetA.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetB.texture, SRGBColorSpace);
      }
    }
  }
  /**
   * An auto sizing flag.
   *
   * @type {Number}
   * @deprecated Use {@link Resolution.AUTO_SIZE} instead.
   */
  static get AUTO_SIZE() {
    return Resolution.AUTO_SIZE;
  }
};

// src/passes/LambdaPass.js
var LambdaPass = class extends Pass {
  /**
   * Constructs a new lambda pass.
   *
   * @param {Function} f - A function.
   */
  constructor(f) {
    super("LambdaPass", null, null);
    this.needsSwap = false;
    this.f = f;
  }
  /**
   * Executes the function.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    this.f();
  }
};

// src/passes/LuminancePass.js
import { UnsignedByteType as UnsignedByteType8, WebGLRenderTarget as WebGLRenderTarget10 } from "three";
var LuminancePass = class extends Pass {
  /**
   * Constructs a new luminance pass.
   *
   * @param {Object} [options] - The options. See {@link LuminanceMaterial} for additional options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor({
    renderTarget,
    luminanceRange,
    colorOutput,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("LuminancePass");
    this.fullscreenMaterial = new LuminanceMaterial(colorOutput, luminanceRange);
    this.needsSwap = false;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget10(1, 1, { depthBuffer: false });
      this.renderTarget.texture.name = "LuminancePass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * The luminance texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the luminance texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Renders the luminance.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const material = this.fullscreenMaterial;
    material.inputBuffer = inputBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType8) {
      this.renderTarget.texture.type = frameBufferType;
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
};

// src/passes/MaskPass.js
var MaskPass = class extends Pass {
  /**
   * Constructs a new mask pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use.
   */
  constructor(scene, camera) {
    super("MaskPass", scene, camera);
    this.needsSwap = false;
    this.clearPass = new ClearPass(false, false, true);
    this.inverse = false;
  }
  set mainScene(value) {
    this.scene = value;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  /**
   * Indicates whether the mask should be inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.inverse;
  }
  set inverted(value) {
    this.inverse = value;
  }
  /**
   * Indicates whether this pass should clear the stencil buffer.
   *
   * @type {Boolean}
   * @deprecated Use clearPass.enabled instead.
   */
  get clear() {
    return this.clearPass.enabled;
  }
  set clear(value) {
    this.clearPass.enabled = value;
  }
  /**
   * Returns the internal clear pass.
   *
   * @deprecated Use clearPass.enabled instead.
   * @return {ClearPass} The clear pass.
   */
  getClearPass() {
    return this.clearPass;
  }
  /**
   * Indicates whether the mask is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the mask is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disable mask inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the mask should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const context = renderer.getContext();
    const buffers = renderer.state.buffers;
    const scene = this.scene;
    const camera = this.camera;
    const clearPass = this.clearPass;
    const writeValue = this.inverted ? 0 : 1;
    const clearValue = 1 - writeValue;
    buffers.color.setMask(false);
    buffers.depth.setMask(false);
    buffers.color.setLocked(true);
    buffers.depth.setLocked(true);
    buffers.stencil.setTest(true);
    buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
    buffers.stencil.setFunc(context.ALWAYS, writeValue, 4294967295);
    buffers.stencil.setClear(clearValue);
    buffers.stencil.setLocked(true);
    if (this.clearPass.enabled) {
      if (this.renderToScreen) {
        clearPass.render(renderer, null);
      } else {
        clearPass.render(renderer, inputBuffer);
        clearPass.render(renderer, outputBuffer);
      }
    }
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    } else {
      renderer.setRenderTarget(inputBuffer);
      renderer.render(scene, camera);
      renderer.setRenderTarget(outputBuffer);
      renderer.render(scene, camera);
    }
    buffers.color.setLocked(false);
    buffers.depth.setLocked(false);
    buffers.stencil.setLocked(false);
    buffers.stencil.setFunc(context.EQUAL, 1, 4294967295);
    buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
    buffers.stencil.setLocked(true);
  }
};

// src/passes/MipmapBlurPass.js
import { UnsignedByteType as UnsignedByteType9, Vector2 as Vector215, WebGLRenderTarget as WebGLRenderTarget11 } from "three";
var MipmapBlurPass = class extends Pass {
  /**
   * Constructs a new mipmap blur pass.
   *
   * @param {Object} [options] - The options.
   */
  constructor() {
    super("MipmapBlurPass");
    this.needsSwap = false;
    this.renderTarget = new WebGLRenderTarget11(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "Upsampling.Mipmap0";
    this.downsamplingMipmaps = [];
    this.upsamplingMipmaps = [];
    this.downsamplingMaterial = new DownsamplingMaterial();
    this.upsamplingMaterial = new UpsamplingMaterial();
    this.resolution = new Vector215();
  }
  /**
   * A texture that contains the blurred result.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * The MIP levels. Default is 8.
   *
   * @type {Number}
   */
  get levels() {
    return this.downsamplingMipmaps.length;
  }
  set levels(value) {
    if (this.levels !== value) {
      const renderTarget = this.renderTarget;
      this.dispose();
      this.downsamplingMipmaps = [];
      this.upsamplingMipmaps = [];
      for (let i = 0; i < value; ++i) {
        const mipmap = renderTarget.clone();
        mipmap.texture.name = "Downsampling.Mipmap" + i;
        this.downsamplingMipmaps.push(mipmap);
      }
      this.upsamplingMipmaps.push(renderTarget);
      for (let i = 1, l = value - 1; i < l; ++i) {
        const mipmap = renderTarget.clone();
        mipmap.texture.name = "Upsampling.Mipmap" + i;
        this.upsamplingMipmaps.push(mipmap);
      }
      this.setSize(this.resolution.x, this.resolution.y);
    }
  }
  /**
   * The blur radius.
   *
   * @type {Number}
   */
  get radius() {
    return this.upsamplingMaterial.radius;
  }
  set radius(value) {
    this.upsamplingMaterial.radius = value;
  }
  /**
   * Renders the blur.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const { scene, camera } = this;
    const { downsamplingMaterial, upsamplingMaterial } = this;
    const { downsamplingMipmaps, upsamplingMipmaps } = this;
    let previousBuffer = inputBuffer;
    this.fullscreenMaterial = downsamplingMaterial;
    for (let i = 0, l = downsamplingMipmaps.length; i < l; ++i) {
      const mipmap = downsamplingMipmaps[i];
      downsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
      downsamplingMaterial.inputBuffer = previousBuffer.texture;
      renderer.setRenderTarget(mipmap);
      renderer.render(scene, camera);
      previousBuffer = mipmap;
    }
    this.fullscreenMaterial = upsamplingMaterial;
    for (let i = upsamplingMipmaps.length - 1; i >= 0; --i) {
      const mipmap = upsamplingMipmaps[i];
      upsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
      upsamplingMaterial.inputBuffer = previousBuffer.texture;
      upsamplingMaterial.supportBuffer = downsamplingMipmaps[i].texture;
      renderer.setRenderTarget(mipmap);
      renderer.render(scene, camera);
      previousBuffer = mipmap;
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.set(width, height);
    let w = resolution.width, h = resolution.height;
    for (let i = 0, l = this.downsamplingMipmaps.length; i < l; ++i) {
      w = Math.round(w * 0.5);
      h = Math.round(h * 0.5);
      this.downsamplingMipmaps[i].setSize(w, h);
      if (i < this.upsamplingMipmaps.length) {
        this.upsamplingMipmaps[i].setSize(w, h);
      }
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0) {
      const mipmaps = this.downsamplingMipmaps.concat(this.upsamplingMipmaps);
      for (const mipmap of mipmaps) {
        mipmap.texture.type = frameBufferType;
      }
      if (frameBufferType !== UnsignedByteType9) {
        this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
        this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
      } else if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        for (const mipmap of mipmaps) {
          setTextureColorSpace(mipmap.texture, SRGBColorSpace);
        }
      }
    }
  }
  /**
   * Deletes internal render targets and textures.
   */
  dispose() {
    super.dispose();
    for (const mipmap of this.downsamplingMipmaps.concat(this.upsamplingMipmaps)) {
      mipmap.dispose();
    }
  }
};

// src/passes/NormalPass.js
import { Color as Color3, MeshNormalMaterial, NearestFilter as NearestFilter5, WebGLRenderTarget as WebGLRenderTarget12 } from "three";
var NormalPass = class extends Pass {
  /**
   * Constructs a new normal pass.
   *
   * @param {Scene} scene - The scene to render.
   * @param {Camera} camera - The camera to use to render the scene.
   * @param {Object} [options] - The options.
   * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    renderTarget,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("NormalPass");
    this.needsSwap = false;
    this.renderPass = new RenderPass(scene, camera, new MeshNormalMaterial());
    const renderPass = this.renderPass;
    renderPass.ignoreBackground = true;
    renderPass.skipShadowMapUpdate = true;
    const clearPass = renderPass.getClearPass();
    clearPass.overrideClearColor = new Color3(7829503);
    clearPass.overrideClearAlpha = 1;
    this.renderTarget = renderTarget;
    if (this.renderTarget === void 0) {
      this.renderTarget = new WebGLRenderTarget12(1, 1, {
        minFilter: NearestFilter5,
        magFilter: NearestFilter5
      });
      this.renderTarget.texture.name = "NormalPass.Target";
    }
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainScene(value) {
    this.renderPass.mainScene = value;
  }
  set mainCamera(value) {
    this.renderPass.mainCamera = value;
  }
  /**
   * The normal texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTarget.texture;
  }
  /**
   * The normal texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.renderTarget.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * Renders the scene normals.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const renderTarget = this.renderToScreen ? null : this.renderTarget;
    this.renderPass.render(renderer, renderTarget, renderTarget);
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
  }
};

// src/passes/ShaderPass.js
import { UnsignedByteType as UnsignedByteType10 } from "three";
var ShaderPass = class extends Pass {
  /**
   * Constructs a new shader pass.
   *
   * @param {ShaderMaterial} material - A shader material.
   * @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
   */
  constructor(material, input = "inputBuffer") {
    super("ShaderPass");
    this.fullscreenMaterial = material;
    this.input = input;
  }
  /**
   * Sets the name of the input buffer uniform.
   *
   * @param {String} input - The name of the input buffer uniform.
   * @deprecated Use input instead.
   */
  setInput(input) {
    this.input = input;
  }
  /**
   * Renders the effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */
  render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
    const uniforms = this.fullscreenMaterial.uniforms;
    if (inputBuffer !== null && uniforms !== void 0 && uniforms[this.input] !== void 0) {
      uniforms[this.input].value = inputBuffer.texture;
    }
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(this.scene, this.camera);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    if (frameBufferType !== void 0 && frameBufferType !== UnsignedByteType10) {
      this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
    }
  }
};

// src/passes/TiltShiftBlurPass.js
var TiltShiftBlurPass = class extends KawaseBlurPass {
  /**
   * Constructs a new Kawase blur pass.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3,
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super({ kernelSize, resolutionScale, resolutionX, resolutionY });
    this.blurMaterial = new TiltShiftBlurMaterial({ kernelSize, offset, rotation, focusArea, feather });
  }
};

// src/core/Timer.js
var MILLISECONDS_TO_SECONDS = 1 / 1e3;
var SECONDS_TO_MILLISECONDS = 1e3;
var Timer = class {
  /**
   * Constructs a new timer.
   */
  constructor() {
    this.startTime = performance.now();
    this.previousTime = 0;
    this.currentTime = 0;
    this._delta = 0;
    this._elapsed = 0;
    this._fixedDelta = 1e3 / 60;
    this.timescale = 1;
    this.useFixedDelta = false;
    this._autoReset = false;
  }
  /**
   * Enables or disables auto reset based on page visibility.
   *
   * If enabled, the timer will be reset when the page becomes visible. This effectively pauses the timer when the page
   * is hidden. Has no effect if the API is not supported.
   *
   * @type {Boolean}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
   */
  get autoReset() {
    return this._autoReset;
  }
  set autoReset(value) {
    if (typeof document !== "undefined" && document.hidden !== void 0) {
      if (value) {
        document.addEventListener("visibilitychange", this);
      } else {
        document.removeEventListener("visibilitychange", this);
      }
      this._autoReset = value;
    }
  }
  get delta() {
    return this._delta * MILLISECONDS_TO_SECONDS;
  }
  get fixedDelta() {
    return this._fixedDelta * MILLISECONDS_TO_SECONDS;
  }
  set fixedDelta(value) {
    this._fixedDelta = value * SECONDS_TO_MILLISECONDS;
  }
  get elapsed() {
    return this._elapsed * MILLISECONDS_TO_SECONDS;
  }
  /**
   * Updates this timer.
   *
   * @param {Boolean} [timestamp] - The current time in milliseconds.
   */
  update(timestamp) {
    if (this.useFixedDelta) {
      this._delta = this.fixedDelta;
    } else {
      this.previousTime = this.currentTime;
      this.currentTime = (timestamp !== void 0 ? timestamp : performance.now()) - this.startTime;
      this._delta = this.currentTime - this.previousTime;
    }
    this._delta *= this.timescale;
    this._elapsed += this._delta;
  }
  /**
   * Resets this timer.
   */
  reset() {
    this._delta = 0;
    this._elapsed = 0;
    this.currentTime = performance.now() - this.startTime;
  }
  handleEvent(e) {
    if (!document.hidden) {
      this.currentTime = performance.now() - this.startTime;
    }
  }
  dispose() {
    this.autoReset = false;
  }
};

// src/core/EffectComposer.js
var EffectComposer = class {
  /**
   * Constructs a new effect composer.
   *
   * @param {WebGLRenderer} renderer - The renderer that should be used.
   * @param {Object} [options] - The options.
   * @param {Boolean} [options.depthBuffer=true] - Whether the main render targets should have a depth buffer.
   * @param {Boolean} [options.stencilBuffer=false] - Whether the main render targets should have a stencil buffer.
   * @param {Boolean} [options.alpha] - Deprecated. Buffers are always RGBA since three r137.
   * @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
   * @param {Number} [options.frameBufferType] - The type of the internal frame buffers. It's recommended to use HalfFloatType if possible.
   */
  constructor(renderer = null, {
    depthBuffer = true,
    stencilBuffer = false,
    multisampling = 0,
    frameBufferType
  } = {}) {
    this.renderer = null;
    this.inputBuffer = this.createBuffer(depthBuffer, stencilBuffer, frameBufferType, multisampling);
    this.outputBuffer = this.inputBuffer.clone();
    this.copyPass = new CopyPass();
    this.depthTexture = null;
    this.passes = [];
    this.timer = new Timer();
    this.autoRenderToScreen = true;
    this.setRenderer(renderer);
  }
  /**
   * The current amount of samples used for multisample anti-aliasing.
   *
   * @type {Number}
   */
  get multisampling() {
    return this.inputBuffer.samples || 0;
  }
  /**
   * Sets the amount of MSAA samples.
   *
   * Requires WebGL 2. Set to zero to disable multisampling.
   *
   * @type {Number}
   */
  set multisampling(value) {
    const buffer = this.inputBuffer;
    const multisampling = this.multisampling;
    if (multisampling > 0 && value > 0) {
      this.inputBuffer.samples = value;
      this.outputBuffer.samples = value;
      this.inputBuffer.dispose();
      this.outputBuffer.dispose();
    } else if (multisampling !== value) {
      this.inputBuffer.dispose();
      this.outputBuffer.dispose();
      this.inputBuffer = this.createBuffer(
        buffer.depthBuffer,
        buffer.stencilBuffer,
        buffer.texture.type,
        value
      );
      this.inputBuffer.depthTexture = this.depthTexture;
      this.outputBuffer = this.inputBuffer.clone();
    }
  }
  /**
   * Returns the internal timer.
   *
   * @return {Timer} The timer.
   */
  getTimer() {
    return this.timer;
  }
  /**
   * Returns the renderer.
   *
   * @return {WebGLRenderer} The renderer.
   */
  getRenderer() {
    return this.renderer;
  }
  /**
   * Sets the renderer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
    if (renderer !== null) {
      const size = renderer.getSize(new Vector216());
      const alpha = renderer.getContext().getContextAttributes().alpha;
      const frameBufferType = this.inputBuffer.texture.type;
      if (frameBufferType === UnsignedByteType11 && getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.inputBuffer.texture, SRGBColorSpace);
        setTextureColorSpace(this.outputBuffer.texture, SRGBColorSpace);
        this.inputBuffer.dispose();
        this.outputBuffer.dispose();
      }
      renderer.autoClear = false;
      this.setSize(size.width, size.height);
      for (const pass of this.passes) {
        pass.initialize(renderer, alpha, frameBufferType);
      }
    }
  }
  /**
   * Replaces the current renderer with the given one.
   *
   * The auto clear mechanism of the provided renderer will be disabled. If the new render size differs from the
   * previous one, all passes will be updated.
   *
   * By default, the DOM element of the current renderer will automatically be removed from its parent node and the DOM
   * element of the new renderer will take its place.
   *
   * @deprecated Use setRenderer instead.
   * @param {WebGLRenderer} renderer - The new renderer.
   * @param {Boolean} updateDOM - Indicates whether the old canvas should be replaced by the new one in the DOM.
   * @return {WebGLRenderer} The old renderer.
   */
  replaceRenderer(renderer, updateDOM = true) {
    const oldRenderer = this.renderer;
    const parent = oldRenderer.domElement.parentNode;
    this.setRenderer(renderer);
    if (updateDOM && parent !== null) {
      parent.removeChild(oldRenderer.domElement);
      parent.appendChild(renderer.domElement);
    }
    return oldRenderer;
  }
  /**
   * Creates a depth texture attachment that will be provided to all passes.
   *
   * Note: When a shader reads from a depth texture and writes to a render target that uses the same depth texture
   * attachment, the depth information will be lost. This happens even if `depthWrite` is disabled.
   *
   * @private
   * @return {DepthTexture} The depth texture.
   */
  createDepthTexture() {
    const depthTexture = this.depthTexture = new DepthTexture();
    this.inputBuffer.depthTexture = depthTexture;
    this.inputBuffer.dispose();
    if (this.inputBuffer.stencilBuffer) {
      depthTexture.format = DepthStencilFormat;
      depthTexture.type = UnsignedInt248Type;
    } else {
      depthTexture.type = UnsignedIntType;
    }
    return depthTexture;
  }
  /**
   * Deletes the current depth texture.
   *
   * @private
   */
  deleteDepthTexture() {
    if (this.depthTexture !== null) {
      this.depthTexture.dispose();
      this.depthTexture = null;
      this.inputBuffer.depthTexture = null;
      this.inputBuffer.dispose();
      for (const pass of this.passes) {
        pass.setDepthTexture(null);
      }
    }
  }
  /**
   * Creates a new render target.
   *
   * @deprecated Create buffers manually via WebGLRenderTarget instead.
   * @param {Boolean} depthBuffer - Whether the render target should have a depth buffer.
   * @param {Boolean} stencilBuffer - Whether the render target should have a stencil buffer.
   * @param {Number} type - The frame buffer type.
   * @param {Number} multisampling - The number of samples to use for antialiasing.
   * @return {WebGLRenderTarget} A new render target that equals the renderer's canvas.
   */
  createBuffer(depthBuffer, stencilBuffer, type, multisampling) {
    const renderer = this.renderer;
    const size = renderer === null ? new Vector216() : renderer.getDrawingBufferSize(new Vector216());
    const options = {
      minFilter: LinearFilter2,
      magFilter: LinearFilter2,
      stencilBuffer,
      depthBuffer,
      type
    };
    const renderTarget = new WebGLRenderTarget13(size.width, size.height, options);
    if (multisampling > 0) {
      renderTarget.ignoreDepthForMultisampleCopy = false;
      renderTarget.samples = multisampling;
    }
    if (type === UnsignedByteType11 && getOutputColorSpace(renderer) === SRGBColorSpace) {
      setTextureColorSpace(renderTarget.texture, SRGBColorSpace);
    }
    renderTarget.texture.name = "EffectComposer.Buffer";
    renderTarget.texture.generateMipmaps = false;
    return renderTarget;
  }
  /**
   * Can be used to change the main scene for all registered passes and effects.
   *
   * @param {Scene} scene - The scene.
   */
  setMainScene(scene) {
    for (const pass of this.passes) {
      pass.mainScene = scene;
    }
  }
  /**
   * Can be used to change the main camera for all registered passes and effects.
   *
   * @param {Camera} camera - The camera.
   */
  setMainCamera(camera) {
    for (const pass of this.passes) {
      pass.mainCamera = camera;
    }
  }
  /**
   * Adds a pass, optionally at a specific index.
   *
   * @param {Pass} pass - A new pass.
   * @param {Number} [index] - An index at which the pass should be inserted.
   */
  addPass(pass, index) {
    const passes = this.passes;
    const renderer = this.renderer;
    const drawingBufferSize = renderer.getDrawingBufferSize(new Vector216());
    const alpha = renderer.getContext().getContextAttributes().alpha;
    const frameBufferType = this.inputBuffer.texture.type;
    pass.setRenderer(renderer);
    pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    pass.initialize(renderer, alpha, frameBufferType);
    if (this.autoRenderToScreen) {
      if (passes.length > 0) {
        passes[passes.length - 1].renderToScreen = false;
      }
      if (pass.renderToScreen) {
        this.autoRenderToScreen = false;
      }
    }
    if (index !== void 0) {
      passes.splice(index, 0, pass);
    } else {
      passes.push(pass);
    }
    if (this.autoRenderToScreen) {
      passes[passes.length - 1].renderToScreen = true;
    }
    if (pass.needsDepthTexture || this.depthTexture !== null) {
      if (this.depthTexture === null) {
        const depthTexture = this.createDepthTexture();
        for (pass of passes) {
          pass.setDepthTexture(depthTexture);
        }
      } else {
        pass.setDepthTexture(this.depthTexture);
      }
    }
  }
  /**
   * Removes a pass.
   *
   * @param {Pass} pass - The pass.
   */
  removePass(pass) {
    const passes = this.passes;
    const index = passes.indexOf(pass);
    const exists = index !== -1;
    const removed = exists && passes.splice(index, 1).length > 0;
    if (removed) {
      if (this.depthTexture !== null) {
        const reducer = (a, b) => a || b.needsDepthTexture;
        const depthTextureRequired = passes.reduce(reducer, false);
        if (!depthTextureRequired) {
          if (pass.getDepthTexture() === this.depthTexture) {
            pass.setDepthTexture(null);
          }
          this.deleteDepthTexture();
        }
      }
      if (this.autoRenderToScreen) {
        if (index === passes.length) {
          pass.renderToScreen = false;
          if (passes.length > 0) {
            passes[passes.length - 1].renderToScreen = true;
          }
        }
      }
    }
  }
  /**
   * Removes all passes.
   */
  removeAllPasses() {
    const passes = this.passes;
    this.deleteDepthTexture();
    if (passes.length > 0) {
      if (this.autoRenderToScreen) {
        passes[passes.length - 1].renderToScreen = false;
      }
      this.passes = [];
    }
  }
  /**
   * Renders all enabled passes in the order in which they were added.
   *
   * @param {Number} [deltaTime] - The time since the last frame in seconds.
   */
  render(deltaTime) {
    const renderer = this.renderer;
    const copyPass = this.copyPass;
    let inputBuffer = this.inputBuffer;
    let outputBuffer = this.outputBuffer;
    let stencilTest = false;
    let context, stencil, buffer;
    if (deltaTime === void 0) {
      this.timer.update();
      deltaTime = this.timer.delta;
    }
    for (const pass of this.passes) {
      if (pass.enabled) {
        pass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
        if (pass.needsSwap) {
          if (stencilTest) {
            copyPass.renderToScreen = pass.renderToScreen;
            context = renderer.getContext();
            stencil = renderer.state.buffers.stencil;
            stencil.setFunc(context.NOTEQUAL, 1, 4294967295);
            copyPass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
            stencil.setFunc(context.EQUAL, 1, 4294967295);
          }
          buffer = inputBuffer;
          inputBuffer = outputBuffer;
          outputBuffer = buffer;
        }
        if (pass instanceof MaskPass) {
          stencilTest = true;
        } else if (pass instanceof ClearMaskPass) {
          stencilTest = false;
        }
      }
    }
  }
  /**
   * Sets the size of the buffers, passes and the renderer.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   * @param {Boolean} [updateStyle] - Determines whether the style of the canvas should be updated.
   */
  setSize(width, height, updateStyle) {
    const renderer = this.renderer;
    const currentSize = renderer.getSize(new Vector216());
    if (width === void 0 || height === void 0) {
      width = currentSize.width;
      height = currentSize.height;
    }
    if (currentSize.width !== width || currentSize.height !== height) {
      renderer.setSize(width, height, updateStyle);
    }
    const drawingBufferSize = renderer.getDrawingBufferSize(new Vector216());
    this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
    this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
    for (const pass of this.passes) {
      pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
    }
  }
  /**
   * Resets this composer by deleting all passes and creating new buffers.
   */
  reset() {
    const autoReset = this.timer.autoReset;
    this.dispose();
    this.autoRenderToScreen = true;
    this.timer.autoReset = autoReset;
  }
  /**
   * Disposes this composer and all passes.
   */
  dispose() {
    for (const pass of this.passes) {
      pass.dispose();
    }
    this.passes = [];
    if (this.inputBuffer !== null) {
      this.inputBuffer.dispose();
    }
    if (this.outputBuffer !== null) {
      this.outputBuffer.dispose();
    }
    this.deleteDepthTexture();
    this.copyPass.dispose();
    this.timer.dispose();
  }
};

// src/core/EffectShaderData.js
var EffectShaderData = class {
  /**
   * Constructs new shader data.
   */
  constructor() {
    this.shaderParts = /* @__PURE__ */ new Map([
      [EffectShaderSection.FRAGMENT_HEAD, null],
      [EffectShaderSection.FRAGMENT_MAIN_UV, null],
      [EffectShaderSection.FRAGMENT_MAIN_IMAGE, null],
      [EffectShaderSection.VERTEX_HEAD, null],
      [EffectShaderSection.VERTEX_MAIN_SUPPORT, null]
    ]);
    this.defines = /* @__PURE__ */ new Map();
    this.uniforms = /* @__PURE__ */ new Map();
    this.blendModes = /* @__PURE__ */ new Map();
    this.extensions = /* @__PURE__ */ new Set();
    this.attributes = EffectAttribute.NONE;
    this.varyings = /* @__PURE__ */ new Set();
    this.uvTransformation = false;
    this.readDepth = false;
    this.colorSpace = LinearSRGBColorSpace;
  }
};

// src/core/GaussKernel.js
function getCoefficients(n) {
  let result;
  if (n === 0) {
    result = new Float64Array(0);
  } else if (n === 1) {
    result = new Float64Array([1]);
  } else if (n > 1) {
    let row0 = new Float64Array(n);
    let row1 = new Float64Array(n);
    for (let y = 1; y <= n; ++y) {
      for (let x = 0; x < y; ++x) {
        row1[x] = x === 0 || x === y - 1 ? 1 : row0[x - 1] + row0[x];
      }
      result = row1;
      row1 = row0;
      row0 = result;
    }
  }
  return result;
}
var GaussKernel = class {
  /**
   * Constructs a new Gauss kernel.
   *
   * @param {Number} kernelSize - The kernel size. Should be an odd number in the range [3, 1020].
   * @param {Number} [edgeBias=2] - Determines how many edge coefficients should be cut off for increased accuracy.
   */
  constructor(kernelSize, edgeBias = 2) {
    this.weights = null;
    this.offsets = null;
    this.linearWeights = null;
    this.linearOffsets = null;
    this.generate(kernelSize, edgeBias);
  }
  /**
   * The number of steps for discrete sampling.
   *
   * @type {Number}
   */
  get steps() {
    return this.offsets === null ? 0 : this.offsets.length;
  }
  /**
   * The number of steps for linear sampling.
   *
   * @type {Number}
   */
  get linearSteps() {
    return this.linearOffsets === null ? 0 : this.linearOffsets.length;
  }
  /**
   * Generates the kernel.
   *
   * @private
   * @param {Number} kernelSize - The kernel size.
   * @param {Number} edgeBias - The amount of edge coefficients to ignore.
   */
  generate(kernelSize, edgeBias) {
    if (kernelSize < 3 || kernelSize > 1020) {
      throw new Error("The kernel size must be in the range [3, 1020]");
    }
    const n = kernelSize + edgeBias * 2;
    const coefficients = edgeBias > 0 ? getCoefficients(n).slice(edgeBias, -edgeBias) : getCoefficients(n);
    const mid = Math.floor((coefficients.length - 1) / 2);
    const sum = coefficients.reduce((a, b) => a + b, 0);
    const weights = coefficients.slice(mid);
    const offsets = [...Array(mid + 1).keys()];
    const linearWeights = new Float64Array(Math.floor(offsets.length / 2));
    const linearOffsets = new Float64Array(linearWeights.length);
    linearWeights[0] = weights[0] / sum;
    for (let i = 1, j = 1, l = offsets.length - 1; i < l; i += 2, ++j) {
      const offset0 = offsets[i], offset1 = offsets[i + 1];
      const weight0 = weights[i], weight1 = weights[i + 1];
      const w = weight0 + weight1;
      const o = (offset0 * weight0 + offset1 * weight1) / w;
      linearWeights[j] = w / sum;
      linearOffsets[j] = o;
    }
    for (let i = 0, l = weights.length, s = 1 / sum; i < l; ++i) {
      weights[i] *= s;
    }
    const linearWeightSum = (linearWeights.reduce((a, b) => a + b, 0) - linearWeights[0] * 0.5) * 2;
    if (linearWeightSum !== 0) {
      for (let i = 0, l = linearWeights.length, s = 1 / linearWeightSum; i < l; ++i) {
        linearWeights[i] *= s;
      }
    }
    this.offsets = offsets;
    this.weights = weights;
    this.linearOffsets = linearOffsets;
    this.linearWeights = linearWeights;
  }
};

// src/core/ImmutableTimer.js
var ImmutableTimer = class {
  /**
   * The current delta time in seconds.
   *
   * @type {Number}
   */
  get delta() {
    return NaN;
  }
  /**
   * The fixed delta time in seconds.
   *
   * @type {Number}
   */
  get fixedDelta() {
    return NaN;
  }
  /**
   * The elapsed time in seconds.
   *
   * @type {Number}
   */
  get elapsed() {
    return NaN;
  }
};

// src/core/Initializable.js
var Initializable = class {
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
  }
};

// src/core/OverrideMaterialManager.js
import { BackSide, DoubleSide, FrontSide, ShaderMaterial as ShaderMaterial22 } from "three";
var workaroundEnabled = false;
var OverrideMaterialManager = class {
  /**
   * Constructs a new override material manager.
   *
   * @param {Material} [material=null] - An override material.
   */
  constructor(material = null) {
    this.originalMaterials = /* @__PURE__ */ new Map();
    this.material = null;
    this.materials = null;
    this.materialsBackSide = null;
    this.materialsDoubleSide = null;
    this.materialsFlatShaded = null;
    this.materialsFlatShadedBackSide = null;
    this.materialsFlatShadedDoubleSide = null;
    this.setMaterial(material);
    this.meshCount = 0;
    this.replaceMaterial = (node) => {
      if (node.isMesh) {
        let materials;
        if (node.material.flatShading) {
          switch (node.material.side) {
            case DoubleSide:
              materials = this.materialsFlatShadedDoubleSide;
              break;
            case BackSide:
              materials = this.materialsFlatShadedBackSide;
              break;
            default:
              materials = this.materialsFlatShaded;
              break;
          }
        } else {
          switch (node.material.side) {
            case DoubleSide:
              materials = this.materialsDoubleSide;
              break;
            case BackSide:
              materials = this.materialsBackSide;
              break;
            default:
              materials = this.materials;
              break;
          }
        }
        this.originalMaterials.set(node, node.material);
        if (node.isSkinnedMesh) {
          node.material = materials[2];
        } else if (node.isInstancedMesh) {
          node.material = materials[1];
        } else {
          node.material = materials[0];
        }
        ++this.meshCount;
      }
    };
  }
  /**
   * Clones the given material.
   *
   * @private
   * @param {Material} material - The material.
   * @return {Material} The cloned material.
   */
  cloneMaterial(material) {
    if (!(material instanceof ShaderMaterial22)) {
      return material.clone();
    }
    const uniforms = material.uniforms;
    const textureUniforms = /* @__PURE__ */ new Map();
    for (const key in uniforms) {
      const value = uniforms[key].value;
      if (value.isRenderTargetTexture) {
        uniforms[key].value = null;
        textureUniforms.set(key, value);
      }
    }
    const clone = material.clone();
    for (const entry of textureUniforms) {
      uniforms[entry[0]].value = entry[1];
      clone.uniforms[entry[0]].value = entry[1];
    }
    return clone;
  }
  /**
   * Sets the override material.
   *
   * @param {Material} material - The material.
   */
  setMaterial(material) {
    this.disposeMaterials();
    this.material = material;
    if (material !== null) {
      const materials = this.materials = [
        this.cloneMaterial(material),
        this.cloneMaterial(material),
        this.cloneMaterial(material)
      ];
      for (const m2 of materials) {
        m2.uniforms = Object.assign({}, material.uniforms);
        m2.side = FrontSide;
      }
      materials[2].skinning = true;
      this.materialsBackSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.side = BackSide;
        return c2;
      });
      this.materialsDoubleSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.side = DoubleSide;
        return c2;
      });
      this.materialsFlatShaded = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        return c2;
      });
      this.materialsFlatShadedBackSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        c2.side = BackSide;
        return c2;
      });
      this.materialsFlatShadedDoubleSide = materials.map((m2) => {
        const c2 = this.cloneMaterial(m2);
        c2.uniforms = Object.assign({}, material.uniforms);
        c2.flatShading = true;
        c2.side = DoubleSide;
        return c2;
      });
    }
  }
  /**
   * Renders the scene with the override material.
   *
   * @private
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Scene} scene - A scene.
   * @param {Camera} camera - A camera.
   */
  render(renderer, scene, camera) {
    const shadowMapEnabled = renderer.shadowMap.enabled;
    renderer.shadowMap.enabled = false;
    if (workaroundEnabled) {
      const originalMaterials = this.originalMaterials;
      this.meshCount = 0;
      scene.traverse(this.replaceMaterial);
      renderer.render(scene, camera);
      for (const entry of originalMaterials) {
        entry[0].material = entry[1];
      }
      if (this.meshCount !== originalMaterials.size) {
        originalMaterials.clear();
      }
    } else {
      const overrideMaterial = scene.overrideMaterial;
      scene.overrideMaterial = this.material;
      renderer.render(scene, camera);
      scene.overrideMaterial = overrideMaterial;
    }
    renderer.shadowMap.enabled = shadowMapEnabled;
  }
  /**
   * Deletes cloned override materials.
   *
   * @private
   */
  disposeMaterials() {
    if (this.material !== null) {
      const materials = this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);
      for (const m2 of materials) {
        m2.dispose();
      }
    }
  }
  /**
   * Performs cleanup tasks.
   */
  dispose() {
    this.originalMaterials.clear();
    this.disposeMaterials();
  }
  /**
   * Indicates whether the override material workaround is enabled.
   *
   * @type {Boolean}
   */
  static get workaroundEnabled() {
    return workaroundEnabled;
  }
  /**
   * Enables or disables the override material workaround globally.
   *
   * This only affects post processing passes and effects.
   *
   * @type {Boolean}
   */
  static set workaroundEnabled(value) {
    workaroundEnabled = value;
  }
};

// src/core/Resizable.js
var Resizable = class {
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
  }
};

// src/core/Resolution.js
import { EventDispatcher, Vector2 as Vector217 } from "three";
var AUTO_SIZE = -1;
var Resolution = class extends EventDispatcher {
  /**
   * Constructs a new resolution.
   *
   * TODO Remove resizable param.
   * @param {Resizable} resizable - A resizable object.
   * @param {Number} [width=Resolution.AUTO_SIZE] - The preferred width.
   * @param {Number} [height=Resolution.AUTO_SIZE] - The preferred height.
   * @param {Number} [scale=1.0] - A resolution scale.
   */
  constructor(resizable, width = AUTO_SIZE, height = AUTO_SIZE, scale = 1) {
    super();
    this.resizable = resizable;
    this.baseSize = new Vector217(1, 1);
    this.preferredSize = new Vector217(width, height);
    this.target = this.preferredSize;
    this.s = scale;
    this.effectiveSize = new Vector217();
    this.addEventListener("change", () => this.updateEffectiveSize());
    this.updateEffectiveSize();
  }
  /**
   * Calculates the effective size.
   *
   * @private
   */
  updateEffectiveSize() {
    const base = this.baseSize;
    const preferred = this.preferredSize;
    const effective = this.effectiveSize;
    const scale = this.scale;
    if (preferred.width !== AUTO_SIZE) {
      effective.width = preferred.width;
    } else if (preferred.height !== AUTO_SIZE) {
      effective.width = Math.round(preferred.height * (base.width / Math.max(base.height, 1)));
    } else {
      effective.width = Math.round(base.width * scale);
    }
    if (preferred.height !== AUTO_SIZE) {
      effective.height = preferred.height;
    } else if (preferred.width !== AUTO_SIZE) {
      effective.height = Math.round(preferred.width / Math.max(base.width / Math.max(base.height, 1), 1));
    } else {
      effective.height = Math.round(base.height * scale);
    }
  }
  /**
   * The effective width.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
   *
   * @type {Number}
   */
  get width() {
    return this.effectiveSize.width;
  }
  set width(value) {
    this.preferredWidth = value;
  }
  /**
   * The effective height.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
   *
   * @type {Number}
   */
  get height() {
    return this.effectiveSize.height;
  }
  set height(value) {
    this.preferredHeight = value;
  }
  /**
   * Returns the effective width.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
   *
   * @deprecated Use width instead.
   * @return {Number} The effective width.
   */
  getWidth() {
    return this.width;
  }
  /**
   * Returns the effective height.
   *
   * If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
   *
   * @deprecated Use height instead.
   * @return {Number} The effective height.
   */
  getHeight() {
    return this.height;
  }
  /**
   * The resolution scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.s;
  }
  set scale(value) {
    if (this.s !== value) {
      this.s = value;
      this.preferredSize.setScalar(AUTO_SIZE);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the current resolution scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The scale.
   */
  getScale() {
    return this.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * Also sets the preferred resolution to {@link Resizer.AUTO_SIZE}.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * The base width.
   *
   * @type {Number}
   */
  get baseWidth() {
    return this.baseSize.width;
  }
  set baseWidth(value) {
    if (this.baseSize.width !== value) {
      this.baseSize.width = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the base width.
   *
   * @deprecated Use baseWidth instead.
   * @return {Number} The base width.
   */
  getBaseWidth() {
    return this.baseWidth;
  }
  /**
   * Sets the base width.
   *
   * @deprecated Use baseWidth instead.
   * @param {Number} value - The width.
   */
  setBaseWidth(value) {
    this.baseWidth = value;
  }
  /**
   * The base height.
   *
   * @type {Number}
   */
  get baseHeight() {
    return this.baseSize.height;
  }
  set baseHeight(value) {
    if (this.baseSize.height !== value) {
      this.baseSize.height = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the base height.
   *
   * @deprecated Use baseHeight instead.
   * @return {Number} The base height.
   */
  getBaseHeight() {
    return this.baseHeight;
  }
  /**
   * Sets the base height.
   *
   * @deprecated Use baseHeight instead.
   * @param {Number} value - The height.
   */
  setBaseHeight(value) {
    this.baseHeight = value;
  }
  /**
   * Sets the base size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setBaseSize(width, height) {
    if (this.baseSize.width !== width || this.baseSize.height !== height) {
      this.baseSize.set(width, height);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * The preferred width.
   *
   * @type {Number}
   */
  get preferredWidth() {
    return this.preferredSize.width;
  }
  set preferredWidth(value) {
    if (this.preferredSize.width !== value) {
      this.preferredSize.width = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the preferred width.
   *
   * @deprecated Use preferredWidth instead.
   * @return {Number} The preferred width.
   */
  getPreferredWidth() {
    return this.preferredWidth;
  }
  /**
   * Sets the preferred width.
   *
   * Use {@link Resizer.AUTO_SIZE} to automatically calculate the width based on the height and aspect ratio.
   *
   * @deprecated Use preferredWidth instead.
   * @param {Number} value - The width.
   */
  setPreferredWidth(value) {
    this.preferredWidth = value;
  }
  /**
   * The preferred height.
   *
   * @type {Number}
   */
  get preferredHeight() {
    return this.preferredSize.height;
  }
  set preferredHeight(value) {
    if (this.preferredSize.height !== value) {
      this.preferredSize.height = value;
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Returns the preferred height.
   *
   * @deprecated Use preferredHeight instead.
   * @return {Number} The preferred height.
   */
  getPreferredHeight() {
    return this.preferredHeight;
  }
  /**
   * Sets the preferred height.
   *
   * Use {@link Resizer.AUTO_SIZE} to automatically calculate the height based on the width and aspect ratio.
   *
   * @deprecated Use preferredHeight instead.
   * @param {Number} value - The height.
   */
  setPreferredHeight(value) {
    this.preferredHeight = value;
  }
  /**
   * Sets the preferred size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setPreferredSize(width, height) {
    if (this.preferredSize.width !== width || this.preferredSize.height !== height) {
      this.preferredSize.set(width, height);
      this.dispatchEvent({ type: "change" });
      this.resizable.setSize(this.baseSize.width, this.baseSize.height);
    }
  }
  /**
   * Copies the given resolution.
   *
   * @param {Resolution} resolution - The resolution.
   */
  copy(resolution) {
    this.s = resolution.scale;
    this.baseSize.set(resolution.baseWidth, resolution.baseHeight);
    this.preferredSize.set(resolution.preferredWidth, resolution.preferredHeight);
    this.dispatchEvent({ type: "change" });
    this.resizable.setSize(this.baseSize.width, this.baseSize.height);
  }
  /**
   * An auto sizing constant.
   *
   * Can be used to automatically calculate the width or height based on the original aspect ratio.
   *
   * @type {Number}
   */
  static get AUTO_SIZE() {
    return AUTO_SIZE;
  }
};

// src/core/Selection.js
var Selection = class extends Set {
  /**
   * Constructs a new selection.
   *
   * @param {Iterable<Object3D>} [iterable] - A collection of objects that should be added to this selection.
   * @param {Number} [layer=10] - A dedicated render layer for selected objects.
   */
  constructor(iterable, layer = 10) {
    super();
    this.l = layer;
    this.exclusive = false;
    if (iterable !== void 0) {
      this.set(iterable);
    }
  }
  /**
   * The render layer for selected objects.
   *
   * @type {Number}
   */
  get layer() {
    return this.l;
  }
  set layer(value) {
    const currentLayer = this.l;
    for (const object of this) {
      object.layers.disable(currentLayer);
      object.layers.enable(value);
    }
    this.l = value;
  }
  /**
   * Returns the current render layer for selected objects.
   *
   * The default layer is 10. If this collides with your own custom layers, please change it before rendering!
   *
   * @deprecated Use layer instead.
   * @return {Number} The layer.
   */
  getLayer() {
    return this.layer;
  }
  /**
   * Sets the render layer for selected objects.
   *
   * The current selection will be updated accordingly.
   *
   * @deprecated Use layer instead.
   * @param {Number} value - The layer. Range is [0, 31].
   */
  setLayer(value) {
    this.layer = value;
  }
  /**
   * Indicates whether objects that are added to this selection will be removed from all other layers.
   *
   * @deprecated Use exclusive instead.
   * @return {Number} Whether this selection is exclusive. Default is false.
   */
  isExclusive() {
    return this.exclusive;
  }
  /**
   * Controls whether objects that are added to this selection should be removed from all other layers.
   *
   * @deprecated Use exclusive instead.
   * @param {Number} value - Whether this selection should be exclusive.
   */
  setExclusive(value) {
    this.exclusive = value;
  }
  /**
   * Clears this selection.
   *
   * @return {Selection} This selection.
   */
  clear() {
    const layer = this.layer;
    for (const object of this) {
      object.layers.disable(layer);
    }
    return super.clear();
  }
  /**
   * Clears this selection and adds the given objects.
   *
   * @param {Iterable<Object3D>} objects - The objects that should be selected.
   * @return {Selection} This selection.
   */
  set(objects) {
    this.clear();
    for (const object of objects) {
      this.add(object);
    }
    return this;
  }
  /**
   * An alias for {@link has}.
   *
   * @param {Object3D} object - An object.
   * @return {Number} Returns 0 if the given object is currently selected, or -1 otherwise.
   * @deprecated Added for backward-compatibility.
   */
  indexOf(object) {
    return this.has(object) ? 0 : -1;
  }
  /**
   * Adds an object to this selection.
   *
   * If {@link exclusive} is set to `true`, the object will also be removed from all other layers.
   *
   * @param {Object3D} object - The object that should be selected.
   * @return {Selection} This selection.
   */
  add(object) {
    if (this.exclusive) {
      object.layers.set(this.layer);
    } else {
      object.layers.enable(this.layer);
    }
    return super.add(object);
  }
  /**
   * Removes an object from this selection.
   *
   * @param {Object3D} object - The object that should be deselected.
   * @return {Boolean} Returns true if an object has successfully been removed from this selection; otherwise false.
   */
  delete(object) {
    if (this.has(object)) {
      object.layers.disable(this.layer);
    }
    return super.delete(object);
  }
  /**
   * Removes an existing object from the selection. If the object doesn't exist it's added instead.
   *
   * @param {Object3D} object - The object.
   * @return {Boolean} Returns true if the object is added, false otherwise.
   */
  toggle(object) {
    let result;
    if (this.has(object)) {
      this.delete(object);
      result = false;
    } else {
      this.add(object);
      result = true;
    }
    return result;
  }
  /**
   * Sets the visibility of all selected objects.
   *
   * This method enables or disables render layer 0 of all selected objects.
   *
   * @param {Boolean} visible - Whether the selected objects should be visible.
   * @return {Selection} This selection.
   */
  setVisible(visible) {
    for (const object of this) {
      if (visible) {
        object.layers.enable(0);
      } else {
        object.layers.disable(0);
      }
    }
    return this;
  }
};

// src/effects/blending/BlendMode.js
import { EventDispatcher as EventDispatcher2, Uniform as Uniform23 } from "three";

// src/effects/blending/glsl/add.frag
var add_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y,opacity);}";

// src/effects/blending/glsl/alpha.frag
var alpha_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,min(y.a,opacity));}";

// src/effects/blending/glsl/average.frag
var average_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y)*0.5,opacity);}";

// src/effects/blending/glsl/color.frag
var color_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.rg,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";

// src/effects/blending/glsl/color-burn.frag
var color_burn_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(step(0.0,y)*(1.0-min(vec4(1.0),(1.0-x)/y)),vec4(1.0),step(1.0,x));return mix(x,z,opacity);}";

// src/effects/blending/glsl/color-dodge.frag
var color_dodge_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=step(0.0,x)*mix(min(vec4(1.0),x/max(1.0-y,1e-9)),vec4(1.0),step(1.0,y));return mix(x,z,opacity);}";

// src/effects/blending/glsl/darken.frag
var darken_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x,y),opacity);}";

// src/effects/blending/glsl/difference.frag
var difference_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,abs(x-y),opacity);}";

// src/effects/blending/glsl/divide.frag
var divide_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x/max(y,1e-12),opacity);}";

// src/effects/blending/glsl/exclusion.frag
var exclusion_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y-2.0*x*y),opacity);}";

// src/effects/blending/glsl/hard-light.frag
var hard_light_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 a=min(x,1.0),b=min(y,1.0);vec4 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,y));return mix(x,z,opacity);}";

// src/effects/blending/glsl/hard-mix.frag
var hard_mix_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,step(1.0,x+y),opacity);}";

// src/effects/blending/glsl/hue.frag
var hue_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.r,xHSL.gb));return vec4(mix(x.rgb,z,opacity),y.a);}";

// src/effects/blending/glsl/invert.frag
var invert_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-y,opacity);}";

// src/effects/blending/glsl/invert-rgb.frag
var invert_rgb_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y*(1.0-x),opacity);}";

// src/effects/blending/glsl/lighten.frag
var lighten_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x,y),opacity);}";

// src/effects/blending/glsl/linear-burn.frag
var linear_burn_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(y+x-1.0,0.0,1.0),opacity);}";

// src/effects/blending/glsl/linear-dodge.frag
var linear_dodge_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x+y,1.0),opacity);}";

// src/effects/blending/glsl/linear-light.frag
var linear_light_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(2.0*y+x-1.0,0.0,1.0),opacity);}";

// src/effects/blending/glsl/luminosity.frag
var luminosity_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.rg,yHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";

// src/effects/blending/glsl/multiply.frag
var multiply_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x*y,opacity);}";

// src/effects/blending/glsl/negation.frag
var negation_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-abs(1.0-x-y),opacity);}";

// src/effects/blending/glsl/normal.frag
var normal_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,opacity);}";

// src/effects/blending/glsl/overlay.frag
var overlay_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(2.0*y*x,1.0-2.0*(1.0-y)*(1.0-x),step(0.5,x));return mix(x,z,opacity);}";

// src/effects/blending/glsl/pin-light.frag
var pin_light_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 z=mix(mix(y2,x,step(0.5*x,y)),max(vec4(0.0),y2-1.0),step(x,(y2-1.0)));return mix(x,z,opacity);}";

// src/effects/blending/glsl/reflect.frag
var reflect_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(min(x*x/max(1.0-y,1e-12),1.0),y,step(1.0,y));return mix(x,z,opacity);}";

// src/effects/blending/glsl/saturation.frag
var saturation_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.r,yHSL.g,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";

// src/effects/blending/glsl/screen.frag
var screen_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y-min(x*y,1.0),opacity);}";

// src/effects/blending/glsl/soft-light.frag
var soft_light_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 w=step(0.5,y);vec4 z=mix(x-(1.0-y2)*x*(1.0-x),mix(x+(y2-1.0)*(sqrt(x)-x),x+(y2-1.0)*x*((16.0*x-12.0)*x+3.0),w*(1.0-step(0.25,x))),w);return mix(x,z,opacity);}";

// src/effects/blending/glsl/src.frag
var src_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}";

// src/effects/blending/glsl/subtract.frag
var subtract_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x+y-1.0,0.0),opacity);}";

// src/effects/blending/glsl/vivid-light.frag
var vivid_light_default = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(max(1.0-min((1.0-x)/(2.0*y),1.0),0.0),min(x/(2.0*(1.0-y)),1.0),step(0.5,y));return mix(x,z,opacity);}";

// src/effects/blending/BlendMode.js
var blendFunctions = /* @__PURE__ */ new Map([
  [BlendFunction.ADD, add_default],
  [BlendFunction.ALPHA, alpha_default],
  [BlendFunction.AVERAGE, average_default],
  [BlendFunction.COLOR, color_default],
  [BlendFunction.COLOR_BURN, color_burn_default],
  [BlendFunction.COLOR_DODGE, color_dodge_default],
  [BlendFunction.DARKEN, darken_default],
  [BlendFunction.DIFFERENCE, difference_default],
  [BlendFunction.DIVIDE, divide_default],
  [BlendFunction.DST, null],
  [BlendFunction.EXCLUSION, exclusion_default],
  [BlendFunction.HARD_LIGHT, hard_light_default],
  [BlendFunction.HARD_MIX, hard_mix_default],
  [BlendFunction.HUE, hue_default],
  [BlendFunction.INVERT, invert_default],
  [BlendFunction.INVERT_RGB, invert_rgb_default],
  [BlendFunction.LIGHTEN, lighten_default],
  [BlendFunction.LINEAR_BURN, linear_burn_default],
  [BlendFunction.LINEAR_DODGE, linear_dodge_default],
  [BlendFunction.LINEAR_LIGHT, linear_light_default],
  [BlendFunction.LUMINOSITY, luminosity_default],
  [BlendFunction.MULTIPLY, multiply_default],
  [BlendFunction.NEGATION, negation_default],
  [BlendFunction.NORMAL, normal_default],
  [BlendFunction.OVERLAY, overlay_default],
  [BlendFunction.PIN_LIGHT, pin_light_default],
  [BlendFunction.REFLECT, reflect_default],
  [BlendFunction.SATURATION, saturation_default],
  [BlendFunction.SCREEN, screen_default],
  [BlendFunction.SOFT_LIGHT, soft_light_default],
  [BlendFunction.SRC, src_default],
  [BlendFunction.SUBTRACT, subtract_default],
  [BlendFunction.VIVID_LIGHT, vivid_light_default]
]);
var BlendMode = class extends EventDispatcher2 {
  /**
   * Constructs a new blend mode.
   *
   * @param {BlendFunction} blendFunction - The blend function.
   * @param {Number} opacity - The opacity of the color that will be blended with the base color.
   */
  constructor(blendFunction, opacity = 1) {
    super();
    this._blendFunction = blendFunction;
    this.opacity = new Uniform23(opacity);
  }
  /**
   * Returns the opacity.
   *
   * @return {Number} The opacity.
   */
  getOpacity() {
    return this.opacity.value;
  }
  /**
   * Sets the opacity.
   *
   * @param {Number} value - The opacity.
   */
  setOpacity(value) {
    this.opacity.value = value;
  }
  /**
   * The blend function.
   *
   * @type {BlendFunction}
   */
  get blendFunction() {
    return this._blendFunction;
  }
  set blendFunction(value) {
    this._blendFunction = value;
    this.dispatchEvent({ type: "change" });
  }
  /**
   * Returns the blend function.
   *
   * @deprecated Use blendFunction instead.
   * @return {BlendFunction} The blend function.
   */
  getBlendFunction() {
    return this.blendFunction;
  }
  /**
   * Sets the blend function.
   *
   * @deprecated Use blendFunction instead.
   * @param {BlendFunction} value - The blend function.
   */
  setBlendFunction(value) {
    this.blendFunction = value;
  }
  /**
   * Returns the blend function shader code.
   *
   * @return {String} The blend function shader code.
   */
  getShaderCode() {
    return blendFunctions.get(this.blendFunction);
  }
};

// src/effects/BloomEffect.js
import { Uniform as Uniform24, WebGLRenderTarget as WebGLRenderTarget15 } from "three";

// src/effects/Effect.js
import { BasicDepthPacking as BasicDepthPacking13, EventDispatcher as EventDispatcher3, Material as Material2, Texture as Texture2, WebGLRenderTarget as WebGLRenderTarget14 } from "three";
var Effect = class extends EventDispatcher3 {
  /**
   * Constructs a new effect.
   *
   * @param {String} name - The name of this effect. Doesn't have to be unique.
   * @param {String} fragmentShader - The fragment shader. This shader is required.
   * @param {Object} [options] - Additional options.
   * @param {EffectAttribute} [options.attributes=EffectAttribute.NONE] - The effect attributes that determine the execution priority and resource requirements.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
   * @param {Map<String, String>} [options.defines] - Custom preprocessor macro definitions. Keys are names and values are code.
   * @param {Map<String, Uniform>} [options.uniforms] - Custom shader uniforms. Keys are names and values are uniforms.
   * @param {Set<WebGLExtension>} [options.extensions] - WebGL extensions.
   * @param {String} [options.vertexShader=null] - The vertex shader. Most effects don't need one.
   */
  constructor(name, fragmentShader, {
    attributes = EffectAttribute.NONE,
    blendFunction = BlendFunction.NORMAL,
    defines = /* @__PURE__ */ new Map(),
    uniforms = /* @__PURE__ */ new Map(),
    extensions = null,
    vertexShader = null
  } = {}) {
    super();
    this.name = name;
    this.renderer = null;
    this.attributes = attributes;
    this.fragmentShader = fragmentShader;
    this.vertexShader = vertexShader;
    this.defines = defines;
    this.uniforms = uniforms;
    this.extensions = extensions;
    this.blendMode = new BlendMode(blendFunction);
    this.blendMode.addEventListener("change", (event) => this.setChanged());
    this._inputColorSpace = LinearSRGBColorSpace;
    this._outputColorSpace = NoColorSpace;
  }
  /**
   * The input color space.
   *
   * @type {ColorSpace}
   * @experimental
   */
  get inputColorSpace() {
    return this._inputColorSpace;
  }
  /**
   * @type {ColorSpace}
   * @protected
   * @experimental
   */
  set inputColorSpace(value) {
    this._inputColorSpace = value;
    this.setChanged();
  }
  /**
   * The output color space.
   *
   * Should only be changed if this effect converts the input colors to a different color space.
   *
   * @type {ColorSpace}
   * @experimental
   */
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  /**
   * @type {ColorSpace}
   * @protected
   * @experimental
   */
  set outputColorSpace(value) {
    this._outputColorSpace = value;
    this.setChanged();
  }
  /**
   * Sets the main scene.
   *
   * @type {Scene}
   */
  set mainScene(value) {
  }
  /**
   * Sets the main camera.
   *
   * @type {Camera}
   */
  set mainCamera(value) {
  }
  /**
   * Returns the name of this effect.
   *
   * @deprecated Use name instead.
   * @return {String} The name.
   */
  getName() {
    return this.name;
  }
  /**
   * Sets the renderer.
   *
   * @deprecated
   * @param {WebGLRenderer} renderer - The renderer.
   */
  setRenderer(renderer) {
    this.renderer = renderer;
  }
  /**
   * Returns the preprocessor macro definitions.
   *
   * @deprecated Use defines instead.
   * @return {Map<String, String>} The extensions.
   */
  getDefines() {
    return this.defines;
  }
  /**
   * Returns the uniforms of this effect.
   *
   * @deprecated Use uniforms instead.
   * @return {Map<String, Uniform>} The extensions.
   */
  getUniforms() {
    return this.uniforms;
  }
  /**
   * Returns the WebGL extensions that are required by this effect.
   *
   * @deprecated Use extensions instead.
   * @return {Set<WebGLExtension>} The extensions.
   */
  getExtensions() {
    return this.extensions;
  }
  /**
   * Returns the blend mode.
   *
   * The result of this effect will be blended with the result of the previous effect using this blend mode.
   *
   * @deprecated Use blendMode instead.
   * @return {BlendMode} The blend mode.
   */
  getBlendMode() {
    return this.blendMode;
  }
  /**
   * Returns the effect attributes.
   *
   * @return {EffectAttribute} The attributes.
   */
  getAttributes() {
    return this.attributes;
  }
  /**
   * Sets the effect attributes.
   *
   * Effects that have the same attributes will be executed in the order in which they were registered. Some attributes
   * imply a higher priority.
   *
   * @protected
   * @param {EffectAttribute} attributes - The attributes.
   */
  setAttributes(attributes) {
    this.attributes = attributes;
    this.setChanged();
  }
  /**
   * Returns the fragment shader.
   *
   * @return {String} The fragment shader.
   */
  getFragmentShader() {
    return this.fragmentShader;
  }
  /**
   * Sets the fragment shader.
   *
   * @protected
   * @param {String} fragmentShader - The fragment shader.
   */
  setFragmentShader(fragmentShader) {
    this.fragmentShader = fragmentShader;
    this.setChanged();
  }
  /**
   * Returns the vertex shader.
   *
   * @return {String} The vertex shader.
   */
  getVertexShader() {
    return this.vertexShader;
  }
  /**
   * Sets the vertex shader.
   *
   * @protected
   * @param {String} vertexShader - The vertex shader.
   */
  setVertexShader(vertexShader) {
    this.vertexShader = vertexShader;
    this.setChanged();
  }
  /**
   * Informs the associated {@link EffectPass} that this effect requires a shader recompilation.
   *
   * Should be called after changing macros or extensions and after adding/removing uniforms.
   *
   * @protected
   */
  setChanged() {
    this.dispatchEvent({ type: "change" });
  }
  /**
   * Sets the depth texture.
   *
   * You may override this method if your effect requires direct access to the depth texture that is bound to the
   * associated {@link EffectPass}.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking13) {
  }
  /**
   * Updates this effect by performing supporting operations.
   *
   * This method is called by the {@link EffectPass} right before the main fullscreen render operation, even if the
   * blend function is set to `SKIP`.
   *
   * You may override this method if you need to update custom uniforms or render additional off-screen textures.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
  }
  /**
   * Updates the size of this effect.
   *
   * You may override this method if you want to be informed about the size of the backbuffer/canvas.
   * This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
  }
  /**
   * Performs initialization tasks.
   *
   * This method is called when the associated {@link EffectPass} is added to an {@link EffectComposer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   * @example if(!alpha && frameBufferType === UnsignedByteType) { this.myRenderTarget.texture.format = RGBFormat; }
   */
  initialize(renderer, alpha, frameBufferType) {
  }
  /**
   * Performs a shallow search for properties that define a dispose method and deletes them.
   *
   * The {@link EffectComposer} calls this method when it is being destroyed.
   */
  dispose() {
    for (const key of Object.keys(this)) {
      const property = this[key];
      const isDisposable = property instanceof WebGLRenderTarget14 || property instanceof Material2 || property instanceof Texture2 || property instanceof Pass;
      if (isDisposable) {
        this[key].dispose();
      }
    }
  }
};

// src/effects/glsl/bloom.frag
var bloom_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D map;\n#else\nuniform lowp sampler2D map;\n#endif\nuniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 texel=texture2D(map,uv);outputColor=vec4(texel.rgb*intensity,texel.a);}";

// src/effects/BloomEffect.js
var BloomEffect = class extends Effect {
  /**
   * Constructs a new bloom effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Number} [options.luminanceThreshold=0.9] - The luminance threshold. Raise this value to mask out darker elements in the scene.
   * @param {Number} [options.luminanceSmoothing=0.025] - Controls the smoothness of the luminance threshold.
   * @param {Boolean} [options.mipmapBlur=false] - Enables or disables mipmap blur.
   * @param {Number} [options.intensity=1.0] - The bloom intensity.
   * @param {Number} [options.radius=0.85] - The blur radius. Only applies to mipmap blur.
   * @param {Number} [options.levels=8] - The amount of MIP levels. Only applies to mipmap blur.
   * @param {KernelSize} [options.kernelSize=KernelSize.LARGE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionScale=0.5] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
   */
  constructor({
    blendFunction = BlendFunction.SCREEN,
    luminanceThreshold = 0.9,
    luminanceSmoothing = 0.025,
    mipmapBlur = false,
    intensity = 1,
    radius = 0.85,
    levels = 8,
    kernelSize = KernelSize.LARGE,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("BloomEffect", bloom_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform24(null)],
        ["intensity", new Uniform24(intensity)]
      ])
    });
    this.renderTarget = new WebGLRenderTarget15(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "Bloom.Target";
    this.blurPass = new KawaseBlurPass({ kernelSize });
    this.luminancePass = new LuminancePass({ colorOutput: true });
    this.luminanceMaterial.threshold = luminanceThreshold;
    this.luminanceMaterial.smoothing = luminanceSmoothing;
    this.mipmapBlurPass = new MipmapBlurPass();
    this.mipmapBlurPass.enabled = mipmapBlur;
    this.mipmapBlurPass.radius = radius;
    this.mipmapBlurPass.levels = levels;
    this.uniforms.get("map").value = mipmapBlur ? this.mipmapBlurPass.texture : this.renderTarget.texture;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  /**
   * A texture that contains the intermediate result of this effect.
   *
   * @type {Texture}
   */
  get texture() {
    return this.mipmapBlurPass.enabled ? this.mipmapBlurPass.texture : this.renderTarget.texture;
  }
  /**
   * Returns the generated bloom texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Returns the blur pass.
   *
   * @deprecated
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the luminance pass.
   *
   * @deprecated Use luminancePass instead.
   * @return {LuminancePass} The luminance pass.
   */
  getLuminancePass() {
    return this.luminancePass;
  }
  /**
   * The luminance material.
   *
   * @type {LuminanceMaterial}
   */
  get luminanceMaterial() {
    return this.luminancePass.fullscreenMaterial;
  }
  /**
   * Returns the luminance material.
   *
   * @deprecated Use luminanceMaterial instead.
   * @return {LuminanceMaterial} The material.
   */
  getLuminanceMaterial() {
    return this.luminancePass.fullscreenMaterial;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated Use EffectPass.dithering instead.
   */
  get dithering() {
    return this.blurPass.dithering;
  }
  set dithering(value) {
    this.blurPass.dithering = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * @type {Number}
   * @deprecated
   */
  get distinction() {
    console.warn(this.name, "distinction was removed");
    return 1;
  }
  set distinction(value) {
    console.warn(this.name, "distinction was removed");
  }
  /**
   * The bloom intensity.
   *
   * @type {Number}
   */
  get intensity() {
    return this.uniforms.get("intensity").value;
  }
  set intensity(value) {
    this.uniforms.get("intensity").value = value;
  }
  /**
   * The bloom intensity.
   *
   * @deprecated Use intensity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.intensity;
  }
  /**
   * Sets the bloom intensity.
   *
   * @deprecated Use intensity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.intensity = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    const luminancePass = this.luminancePass;
    if (luminancePass.enabled) {
      luminancePass.render(renderer, inputBuffer);
      if (this.mipmapBlurPass.enabled) {
        this.mipmapBlurPass.render(renderer, luminancePass.renderTarget);
      } else {
        this.blurPass.render(renderer, luminancePass.renderTarget, renderTarget);
      }
    } else {
      if (this.mipmapBlurPass.enabled) {
        this.mipmapBlurPass.render(renderer, inputBuffer);
      } else {
        this.blurPass.render(renderer, inputBuffer, renderTarget);
      }
    }
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.blurPass.resolution.copy(resolution);
    this.luminancePass.setSize(width, height);
    this.mipmapBlurPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    this.luminancePass.initialize(renderer, alpha, frameBufferType);
    this.mipmapBlurPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTarget.texture, SRGBColorSpace);
      }
    }
  }
};

// src/effects/BokehEffect.js
import { Uniform as Uniform25 } from "three";

// src/effects/glsl/bokeh.frag
var bokeh_default = "uniform float focus;uniform float dof;uniform float aperture;uniform float maxBlur;void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){vec2 aspectCorrection=vec2(1.0,aspect);\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);\n#else\nfloat linearDepth=depth;\n#endif\nfloat focusNear=clamp(focus-dof,0.0,1.0);float focusFar=clamp(focus+dof,0.0,1.0);float low=step(linearDepth,focusNear);float high=step(focusFar,linearDepth);float factor=(linearDepth-focusNear)*low+(linearDepth-focusFar)*high;vec2 dofBlur=vec2(clamp(factor*aperture,-maxBlur,maxBlur));vec2 dofblur9=dofBlur*0.9;vec2 dofblur7=dofBlur*0.7;vec2 dofblur4=dofBlur*0.4;vec4 color=inputColor;color+=texture2D(inputBuffer,uv+(vec2(0.0,0.4)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.15,0.37)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.29,0.29)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.37,0.15)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.40,0.0)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.37,-0.15)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.29,-0.29)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.15,-0.37)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.0,-0.4)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.15,0.37)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.29,0.29)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.37,0.15)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.4,0.0)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.37,-0.15)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(-0.29,-0.29)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.15,-0.37)*aspectCorrection)*dofBlur);color+=texture2D(inputBuffer,uv+(vec2(0.15,0.37)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(-0.37,0.15)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(0.37,-0.15)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(-0.15,-0.37)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(-0.15,0.37)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(0.37,0.15)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(-0.37,-0.15)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(0.15,-0.37)*aspectCorrection)*dofblur9);color+=texture2D(inputBuffer,uv+(vec2(0.29,0.29)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(0.40,0.0)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(0.29,-0.29)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(0.0,-0.4)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(-0.29,0.29)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(-0.4,0.0)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(-0.29,-0.29)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(0.0,0.4)*aspectCorrection)*dofblur7);color+=texture2D(inputBuffer,uv+(vec2(0.29,0.29)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(0.4,0.0)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(0.29,-0.29)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(0.0,-0.4)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(-0.29,0.29)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(-0.4,0.0)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(-0.29,-0.29)*aspectCorrection)*dofblur4);color+=texture2D(inputBuffer,uv+(vec2(0.0,0.4)*aspectCorrection)*dofblur4);outputColor=color/41.0;}";

// src/effects/BokehEffect.js
var BokehEffect = class extends Effect {
  /**
   * Constructs a new bokeh effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.focus=0.5] - The focus distance ratio, ranging from 0.0 to 1.0.
   * @param {Number} [options.dof=0.02] - Depth of field. An area in front of and behind the focal point that still appears sharp.
   * @param {Number} [options.aperture=0.015] - Camera aperture scale. Bigger values for stronger blur and shallower depth of field.
   * @param {Number} [options.maxBlur=1.0] - The maximum blur strength.
   */
  constructor({
    blendFunction,
    focus = 0.5,
    dof = 0.02,
    aperture = 0.015,
    maxBlur = 1
  } = {}) {
    super("BokehEffect", bokeh_default, {
      blendFunction,
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["focus", new Uniform25(focus)],
        ["dof", new Uniform25(dof)],
        ["aperture", new Uniform25(aperture)],
        ["maxBlur", new Uniform25(maxBlur)]
      ])
    });
  }
};

// src/effects/BrightnessContrastEffect.js
import { Uniform as Uniform26 } from "three";

// src/effects/glsl/brightness-contrast.frag
var brightness_contrast_default = "uniform float brightness;uniform float contrast;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=inputColor.rgb+vec3(brightness-0.5);if(contrast>0.0){color/=vec3(1.0-contrast);}else{color*=vec3(1.0+contrast);}outputColor=vec4(color+vec3(0.5),inputColor.a);}";

// src/effects/BrightnessContrastEffect.js
var BrightnessContrastEffect = class extends Effect {
  /**
   * Constructs a new brightness/contrast effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Number} [options.brightness=0.0] - The brightness factor, ranging from -1 to 1, where 0 means no change.
   * @param {Number} [options.contrast=0.0] - The contrast factor, ranging from -1 to 1, where 0 means no change.
   */
  constructor({ blendFunction = BlendFunction.SRC, brightness = 0, contrast = 0 } = {}) {
    super("BrightnessContrastEffect", brightness_contrast_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["brightness", new Uniform26(brightness)],
        ["contrast", new Uniform26(contrast)]
      ])
    });
    this.inputColorSpace = SRGBColorSpace;
  }
  /**
   * The brightness.
   *
   * @type {Number}
   */
  get brightness() {
    return this.uniforms.get("brightness").value;
  }
  set brightness(value) {
    this.uniforms.get("brightness").value = value;
  }
  /**
   * Returns the brightness.
   *
   * @deprecated Use brightness instead.
   * @return {Number} The brightness.
   */
  getBrightness() {
    return this.brightness;
  }
  /**
   * Sets the brightness.
   *
   * @deprecated Use brightness instead.
   * @param {Number} value - The brightness.
   */
  setBrightness(value) {
    this.brightness = value;
  }
  /**
   * The contrast.
   *
   * @type {Number}
   */
  get contrast() {
    return this.uniforms.get("contrast").value;
  }
  set contrast(value) {
    this.uniforms.get("contrast").value = value;
  }
  /**
   * Returns the contrast.
   *
   * @deprecated Use contrast instead.
   * @return {Number} The contrast.
   */
  getContrast() {
    return this.contrast;
  }
  /**
   * Sets the contrast.
   *
   * @deprecated Use contrast instead.
   * @param {Number} value - The contrast.
   */
  setContrast(value) {
    this.contrast = value;
  }
};

// src/effects/glsl/color-average.frag
var color_average_default = "void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=vec4(vec3(average(inputColor.rgb)),inputColor.a);}";

// src/effects/ColorAverageEffect.js
var ColorAverageEffect = class extends Effect {
  /**
   * Constructs a new color average effect.
   *
   * @param {BlendFunction} [blendFunction] - The blend function of this effect.
   */
  constructor(blendFunction) {
    super("ColorAverageEffect", color_average_default, { blendFunction });
  }
};

// src/effects/ColorDepthEffect.js
import { Uniform as Uniform27 } from "three";

// src/effects/glsl/color-depth.frag
var color_depth_default = "uniform float factor;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=vec4(floor(inputColor.rgb*factor+0.5)/factor,inputColor.a);}";

// src/effects/ColorDepthEffect.js
var ColorDepthEffect = class extends Effect {
  /**
   * Constructs a new color depth effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.bits=16] - The color bit depth.
   */
  constructor({ blendFunction, bits = 16 } = {}) {
    super("ColorDepthEffect", color_depth_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["factor", new Uniform27(1)]
      ])
    });
    this.bits = 0;
    this.bitDepth = bits;
  }
  /**
   * The virtual amount of color bits.
   *
   * Each color channel effectively uses a fourth of the total amount of bits. Alpha remains unaffected.
   *
   * @type {Number}
   */
  get bitDepth() {
    return this.bits;
  }
  set bitDepth(value) {
    this.bits = value;
    this.uniforms.get("factor").value = Math.pow(2, value / 3);
  }
  /**
   * Returns the current color bit depth.
   *
   * @return {Number} The bit depth.
   */
  getBitDepth() {
    return this.bitDepth;
  }
  /**
   * Sets the virtual amount of color bits.
   *
   * @param {Number} value - The bit depth.
   */
  setBitDepth(value) {
    this.bitDepth = value;
  }
};

// src/effects/ChromaticAberrationEffect.js
import { Uniform as Uniform28, Vector2 as Vector218 } from "three";

// src/effects/glsl/chromatic-aberration.frag
var chromatic_aberration_default = "#ifdef RADIAL_MODULATION\nuniform float modulationOffset;\n#endif\nvarying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;\n#ifdef RADIAL_MODULATION\nconst vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}\n#else\nif(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}\n#endif\noutputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}";

// src/effects/glsl/chromatic-aberration.vert
var chromatic_aberration_default2 = "uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}";

// src/effects/ChromaticAberrationEffect.js
var ChromaticAberrationEffect = class extends Effect {
  /**
   * Constructs a new chromatic aberration effect.
   *
   * @param {Object} [options] - The options.
   * @param {Vector2} [options.offset] - The color offset.
   * @param {Boolean} [options.radialModulation=false] - Whether the effect should be modulated with a radial gradient.
   * @param {Number} [options.modulationOffset=0.15] - The modulation offset. Only applies if `radialModulation` is enabled.
   */
  constructor({
    offset = new Vector218(1e-3, 5e-4),
    radialModulation = false,
    modulationOffset = 0.15
  } = {}) {
    super("ChromaticAberrationEffect", chromatic_aberration_default, {
      vertexShader: chromatic_aberration_default2,
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: /* @__PURE__ */ new Map([
        ["offset", new Uniform28(offset)],
        ["modulationOffset", new Uniform28(modulationOffset)]
      ])
    });
    this.radialModulation = radialModulation;
  }
  /**
   * The color offset.
   *
   * @type {Vector2}
   */
  get offset() {
    return this.uniforms.get("offset").value;
  }
  set offset(value) {
    this.uniforms.get("offset").value = value;
  }
  /**
   * Indicates whether radial modulation is enabled.
   *
   * When enabled, the effect will be weaker in the middle and stronger towards the screen edges.
   *
   * @type {Boolean}
   */
  get radialModulation() {
    return this.defines.has("RADIAL_MODULATION");
  }
  set radialModulation(value) {
    if (value) {
      this.defines.set("RADIAL_MODULATION", "1");
    } else {
      this.defines.delete("RADIAL_MODULATION");
    }
    this.setChanged();
  }
  /**
   * The modulation offset.
   *
   * @type {Number}
   */
  get modulationOffset() {
    return this.uniforms.get("modulationOffset").value;
  }
  set modulationOffset(value) {
    this.uniforms.get("modulationOffset").value = value;
  }
  /**
   * Returns the color offset vector.
   *
   * @deprecated Use offset instead.
   * @return {Vector2} The offset.
   */
  getOffset() {
    return this.offset;
  }
  /**
   * Sets the color offset vector.
   *
   * @deprecated Use offset instead.
   * @param {Vector2} value - The offset.
   */
  setOffset(value) {
    this.offset = value;
  }
};

// src/effects/glsl/depth.frag
var depth_default = "void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){\n#ifdef INVERTED\nvec3 color=vec3(1.0-depth);\n#else\nvec3 color=vec3(depth);\n#endif\noutputColor=vec4(color,inputColor.a);}";

// src/effects/DepthEffect.js
var DepthEffect = class extends Effect {
  /**
   * Constructs a new depth effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.inverted=false] - Whether the depth should be inverted.
   */
  constructor({ blendFunction = BlendFunction.SRC, inverted = false } = {}) {
    super("DepthEffect", depth_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH
    });
    this.inverted = inverted;
  }
  /**
   * Indicates whether depth should be inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this.defines.has("INVERTED");
  }
  set inverted(value) {
    if (this.inverted !== value) {
      if (value) {
        this.defines.set("INVERTED", "1");
      } else {
        this.defines.delete("INVERTED");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the rendered depth is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the rendered depth is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disables depth inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether depth should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
};

// src/effects/DepthOfFieldEffect.js
import { BasicDepthPacking as BasicDepthPacking14, Uniform as Uniform29, UnsignedByteType as UnsignedByteType12, WebGLRenderTarget as WebGLRenderTarget16 } from "three";

// src/effects/glsl/depth-of-field.frag
var depth_of_field_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D nearColorBuffer;uniform mediump sampler2D farColorBuffer;\n#else\nuniform lowp sampler2D nearColorBuffer;uniform lowp sampler2D farColorBuffer;\n#endif\nuniform lowp sampler2D nearCoCBuffer;uniform lowp sampler2D farCoCBuffer;uniform float scale;void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){vec4 colorNear=texture2D(nearColorBuffer,uv);vec4 colorFar=texture2D(farColorBuffer,uv);\n#if MASK_FUNCTION == 1\nvec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,colorFar.a);cocNearFar.x=min(cocNearFar.x*scale,1.0);\n#else\nvec2 cocNearFar=vec2(texture2D(nearCoCBuffer,uv).r,texture2D(farCoCBuffer,uv).g);cocNearFar=min(cocNearFar*scale,1.0);\n#endif\nvec4 result=inputColor*(1.0-cocNearFar.y)+colorFar;result=mix(result,colorNear,cocNearFar.x);outputColor=result;}";

// src/effects/DepthOfFieldEffect.js
var DepthOfFieldEffect = class extends Effect {
  /**
   * Constructs a new depth of field effect.
   *
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.worldFocusDistance] - The focus distance in world units.
   * @param {Number} [options.worldFocusRange] - The focus distance in world units.
   * @param {Number} [options.focusDistance=0.0] - The normalized focus distance. Range is [0.0, 1.0].
   * @param {Number} [options.focusRange=0.1] - The focus range. Range is [0.0, 1.0].
   * @param {Number} [options.focalLength=0.1] - Deprecated.
   * @param {Number} [options.bokehScale=1.0] - The scale of the bokeh blur.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(camera, {
    blendFunction,
    worldFocusDistance,
    worldFocusRange,
    focusDistance = 0,
    focalLength = 0.1,
    focusRange = focalLength,
    bokehScale = 1,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("DepthOfFieldEffect", depth_of_field_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["nearColorBuffer", new Uniform29(null)],
        ["farColorBuffer", new Uniform29(null)],
        ["nearCoCBuffer", new Uniform29(null)],
        ["farCoCBuffer", new Uniform29(null)],
        ["scale", new Uniform29(1)]
      ])
    });
    this.camera = camera;
    this.renderTarget = new WebGLRenderTarget16(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "DoF.Intermediate";
    this.renderTargetMasked = this.renderTarget.clone();
    this.renderTargetMasked.texture.name = "DoF.Masked.Far";
    this.renderTargetNear = this.renderTarget.clone();
    this.renderTargetNear.texture.name = "DoF.Bokeh.Near";
    this.uniforms.get("nearColorBuffer").value = this.renderTargetNear.texture;
    this.renderTargetFar = this.renderTarget.clone();
    this.renderTargetFar.texture.name = "DoF.Bokeh.Far";
    this.uniforms.get("farColorBuffer").value = this.renderTargetFar.texture;
    this.renderTargetCoC = this.renderTarget.clone();
    this.renderTargetCoC.texture.name = "DoF.CoC";
    this.uniforms.get("farCoCBuffer").value = this.renderTargetCoC.texture;
    this.renderTargetCoCBlurred = this.renderTargetCoC.clone();
    this.renderTargetCoCBlurred.texture.name = "DoF.CoC.Blurred";
    this.uniforms.get("nearCoCBuffer").value = this.renderTargetCoCBlurred.texture;
    this.cocPass = new ShaderPass(new CircleOfConfusionMaterial(camera));
    const cocMaterial = this.cocMaterial;
    cocMaterial.focusDistance = focusDistance;
    cocMaterial.focusRange = focusRange;
    if (worldFocusDistance !== void 0) {
      cocMaterial.worldFocusDistance = worldFocusDistance;
    }
    if (worldFocusRange !== void 0) {
      cocMaterial.worldFocusRange = worldFocusRange;
    }
    this.blurPass = new KawaseBlurPass({ resolutionScale, resolutionX, resolutionY, kernelSize: KernelSize.MEDIUM });
    this.maskPass = new ShaderPass(new MaskMaterial(this.renderTargetCoC.texture));
    const maskMaterial = this.maskPass.fullscreenMaterial;
    maskMaterial.colorChannel = ColorChannel.GREEN;
    this.maskFunction = MaskFunction.MULTIPLY_RGB;
    this.bokehNearBasePass = new ShaderPass(new BokehMaterial(false, true));
    this.bokehNearBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture;
    this.bokehNearFillPass = new ShaderPass(new BokehMaterial(true, true));
    this.bokehNearFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoCBlurred.texture;
    this.bokehFarBasePass = new ShaderPass(new BokehMaterial(false, false));
    this.bokehFarBasePass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture;
    this.bokehFarFillPass = new ShaderPass(new BokehMaterial(true, false));
    this.bokehFarFillPass.fullscreenMaterial.cocBuffer = this.renderTargetCoC.texture;
    this.target = null;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.bokehScale = bokehScale;
  }
  set mainCamera(value) {
    this.camera = value;
    this.cocMaterial.copyCameraSettings(value);
  }
  /**
   * The circle of confusion texture.
   *
   * @type {Texture}
   */
  get cocTexture() {
    return this.renderTargetCoC.texture;
  }
  /**
   * The mask function. Default is `MULTIPLY_RGB`.
   *
   * @type {MaskFunction}
   */
  get maskFunction() {
    return this.maskPass.fullscreenMaterial.maskFunction;
  }
  set maskFunction(value) {
    if (this.maskFunction !== value) {
      this.defines.set("MASK_FUNCTION", value.toFixed(0));
      this.maskPass.fullscreenMaterial.maskFunction = value;
      this.setChanged();
    }
  }
  /**
   * The circle of confusion material.
   *
   * @type {CircleOfConfusionMaterial}
   */
  get cocMaterial() {
    return this.cocPass.fullscreenMaterial;
  }
  /**
   * The circle of confusion material.
   *
   * @deprecated Use cocMaterial instead.
   * @type {CircleOfConfusionMaterial}
   */
  get circleOfConfusionMaterial() {
    return this.cocMaterial;
  }
  /**
   * Returns the circle of confusion material.
   *
   * @deprecated Use cocMaterial instead.
   * @return {CircleOfConfusionMaterial} The material.
   */
  getCircleOfConfusionMaterial() {
    return this.cocMaterial;
  }
  /**
   * Returns the pass that blurs the foreground CoC buffer to soften edges.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The current bokeh scale.
   *
   * @type {Number}
   */
  get bokehScale() {
    return this.uniforms.get("scale").value;
  }
  set bokehScale(value) {
    this.bokehNearBasePass.fullscreenMaterial.scale = value;
    this.bokehNearFillPass.fullscreenMaterial.scale = value;
    this.bokehFarBasePass.fullscreenMaterial.scale = value;
    this.bokehFarFillPass.fullscreenMaterial.scale = value;
    this.maskPass.fullscreenMaterial.strength = value;
    this.uniforms.get("scale").value = value;
  }
  /**
   * Returns the current bokeh scale.
   *
   * @deprecated Use bokehScale instead.
   * @return {Number} The scale.
   */
  getBokehScale() {
    return this.bokehScale;
  }
  /**
   * Sets the bokeh scale.
   *
   * @deprecated Use bokehScale instead.
   * @param {Number} value - The scale.
   */
  setBokehScale(value) {
    this.bokehScale = value;
  }
  /**
   * Returns the current auto focus target.
   *
   * @deprecated Use target instead.
   * @return {Vector3} The target.
   */
  getTarget() {
    return this.target;
  }
  /**
   * Sets the auto focus target.
   *
   * @deprecated Use target instead.
   * @param {Vector3} value - The target.
   */
  setTarget(value) {
    this.target = value;
  }
  /**
   * Calculates the focus distance from the camera to the given position.
   *
   * @param {Vector3} target - The target.
   * @return {Number} The normalized focus distance.
   */
  calculateFocusDistance(target) {
    const camera = this.camera;
    const distance = camera.position.distanceTo(target);
    return viewZToOrthographicDepth(-distance, camera.near, camera.far);
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking14) {
    this.cocMaterial.depthBuffer = depthTexture;
    this.cocMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    const renderTargetCoC = this.renderTargetCoC;
    const renderTargetCoCBlurred = this.renderTargetCoCBlurred;
    const renderTargetMasked = this.renderTargetMasked;
    if (this.target !== null) {
      const distance = this.calculateFocusDistance(this.target);
      this.cocMaterial.focusDistance = distance;
    }
    this.cocPass.render(renderer, null, renderTargetCoC);
    this.blurPass.render(renderer, renderTargetCoC, renderTargetCoCBlurred);
    this.maskPass.render(renderer, inputBuffer, renderTargetMasked);
    this.bokehFarBasePass.render(renderer, renderTargetMasked, renderTarget);
    this.bokehFarFillPass.render(renderer, renderTarget, this.renderTargetFar);
    this.bokehNearBasePass.render(renderer, inputBuffer, renderTarget);
    this.bokehNearFillPass.render(renderer, renderTarget, this.renderTargetNear);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.cocPass.setSize(width, height);
    this.blurPass.setSize(width, height);
    this.maskPass.setSize(width, height);
    this.renderTargetFar.setSize(width, height);
    this.renderTargetCoC.setSize(width, height);
    this.renderTargetMasked.setSize(width, height);
    this.renderTarget.setSize(w, h);
    this.renderTargetNear.setSize(w, h);
    this.renderTargetCoCBlurred.setSize(w, h);
    this.bokehNearBasePass.fullscreenMaterial.setSize(width, height);
    this.bokehNearFillPass.fullscreenMaterial.setSize(width, height);
    this.bokehFarBasePass.fullscreenMaterial.setSize(width, height);
    this.bokehFarFillPass.fullscreenMaterial.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.cocPass.initialize(renderer, alpha, frameBufferType);
    this.maskPass.initialize(renderer, alpha, frameBufferType);
    this.bokehNearBasePass.initialize(renderer, alpha, frameBufferType);
    this.bokehNearFillPass.initialize(renderer, alpha, frameBufferType);
    this.bokehFarBasePass.initialize(renderer, alpha, frameBufferType);
    this.bokehFarFillPass.initialize(renderer, alpha, frameBufferType);
    this.blurPass.initialize(renderer, alpha, UnsignedByteType12);
    if (renderer.capabilities.logarithmicDepthBuffer) {
      this.cocPass.fullscreenMaterial.defines.LOG_DEPTH = "1";
    }
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      this.renderTargetNear.texture.type = frameBufferType;
      this.renderTargetFar.texture.type = frameBufferType;
      this.renderTargetMasked.texture.type = frameBufferType;
      if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTarget.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetNear.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetFar.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetMasked.texture, SRGBColorSpace);
      }
    }
  }
};

// src/effects/DotScreenEffect.js
import { Uniform as Uniform30, Vector2 as Vector219 } from "three";

// src/effects/glsl/dot-screen.frag
var dot_screen_default = "uniform vec2 angle;uniform float scale;float pattern(const in vec2 uv){vec2 point=scale*vec2(dot(angle.yx,vec2(uv.x,-uv.y)),dot(angle,uv));return(sin(point.x)*sin(point.y))*4.0;}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(inputColor.rgb*10.0-5.0+pattern(uv*resolution));outputColor=vec4(color,inputColor.a);}";

// src/effects/DotScreenEffect.js
var DotScreenEffect = class extends Effect {
  /**
   * Constructs a new dot screen effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.angle=1.57] - The angle of the dot pattern.
   * @param {Number} [options.scale=1.0] - The scale of the dot pattern.
   */
  constructor({ blendFunction, angle = Math.PI * 0.5, scale = 1 } = {}) {
    super("DotScreenEffect", dot_screen_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["angle", new Uniform30(new Vector219())],
        ["scale", new Uniform30(scale)]
      ])
    });
    this.angle = angle;
  }
  /**
   * The angle.
   *
   * @type {Number}
   */
  get angle() {
    return Math.acos(this.uniforms.get("angle").value.y);
  }
  set angle(value) {
    this.uniforms.get("angle").value.set(Math.sin(value), Math.cos(value));
  }
  /**
   * Returns the pattern angle.
   *
   * @deprecated Use angle instead.
   * @return {Number} The angle in radians.
   */
  getAngle() {
    return this.angle;
  }
  /**
   * Sets the pattern angle.
   *
   * @deprecated Use angle instead.
   * @param {Number} value - The angle in radians.
   */
  setAngle(value) {
    this.angle = value;
  }
  /**
   * The scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.uniforms.get("scale").value;
  }
  set scale(value) {
    this.uniforms.get("scale").value = value;
  }
};

// src/effects/glsl/fxaa.frag
var fxaa_default = "#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\n#define QUALITY(q) ((q) < 5 ? 1.0 : ((q) > 5 ? ((q) < 10 ? 2.0 : ((q) < 11 ? 4.0 : 8.0)) : 1.5))\n#define ONE_OVER_TWELVE 0.08333333333333333\nvarying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;vec4 fxaa(const in vec4 inputColor,const in vec2 uv){float lumaCenter=luminance(inputColor.rgb);float lumaDown=luminance(texture2D(inputBuffer,vUvDown).rgb);float lumaUp=luminance(texture2D(inputBuffer,vUvUp).rgb);float lumaLeft=luminance(texture2D(inputBuffer,vUvLeft).rgb);float lumaRight=luminance(texture2D(inputBuffer,vUvRight).rgb);float lumaMin=min(lumaCenter,min(min(lumaDown,lumaUp),min(lumaLeft,lumaRight)));float lumaMax=max(lumaCenter,max(max(lumaDown,lumaUp),max(lumaLeft,lumaRight)));float lumaRange=lumaMax-lumaMin;if(lumaRange<max(EDGE_THRESHOLD_MIN,lumaMax*EDGE_THRESHOLD_MAX)){return inputColor;}float lumaDownLeft=luminance(texture2D(inputBuffer,vUvDownLeft).rgb);float lumaUpRight=luminance(texture2D(inputBuffer,vUvUpRight).rgb);float lumaUpLeft=luminance(texture2D(inputBuffer,vUvUpLeft).rgb);float lumaDownRight=luminance(texture2D(inputBuffer,vUvDownRight).rgb);float lumaDownUp=lumaDown+lumaUp;float lumaLeftRight=lumaLeft+lumaRight;float lumaLeftCorners=lumaDownLeft+lumaUpLeft;float lumaDownCorners=lumaDownLeft+lumaDownRight;float lumaRightCorners=lumaDownRight+lumaUpRight;float lumaUpCorners=lumaUpRight+lumaUpLeft;float edgeHorizontal=(abs(-2.0*lumaLeft+lumaLeftCorners)+abs(-2.0*lumaCenter+lumaDownUp)*2.0+abs(-2.0*lumaRight+lumaRightCorners));float edgeVertical=(abs(-2.0*lumaUp+lumaUpCorners)+abs(-2.0*lumaCenter+lumaLeftRight)*2.0+abs(-2.0*lumaDown+lumaDownCorners));bool isHorizontal=(edgeHorizontal>=edgeVertical);float stepLength=isHorizontal?texelSize.y:texelSize.x;float luma1=isHorizontal?lumaDown:lumaLeft;float luma2=isHorizontal?lumaUp:lumaRight;float gradient1=abs(luma1-lumaCenter);float gradient2=abs(luma2-lumaCenter);bool is1Steepest=gradient1>=gradient2;float gradientScaled=0.25*max(gradient1,gradient2);float lumaLocalAverage=0.0;if(is1Steepest){stepLength=-stepLength;lumaLocalAverage=0.5*(luma1+lumaCenter);}else{lumaLocalAverage=0.5*(luma2+lumaCenter);}vec2 currentUv=uv;if(isHorizontal){currentUv.y+=stepLength*0.5;}else{currentUv.x+=stepLength*0.5;}vec2 offset=isHorizontal?vec2(texelSize.x,0.0):vec2(0.0,texelSize.y);vec2 uv1=currentUv-offset*QUALITY(0);vec2 uv2=currentUv+offset*QUALITY(0);float lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);float lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd1-=lumaLocalAverage;lumaEnd2-=lumaLocalAverage;bool reached1=abs(lumaEnd1)>=gradientScaled;bool reached2=abs(lumaEnd2)>=gradientScaled;bool reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(1);}if(!reached2){uv2+=offset*QUALITY(1);}if(!reachedBoth){for(int i=2;i<SAMPLES;++i){if(!reached1){lumaEnd1=luminance(texture2D(inputBuffer,uv1).rgb);lumaEnd1=lumaEnd1-lumaLocalAverage;}if(!reached2){lumaEnd2=luminance(texture2D(inputBuffer,uv2).rgb);lumaEnd2=lumaEnd2-lumaLocalAverage;}reached1=abs(lumaEnd1)>=gradientScaled;reached2=abs(lumaEnd2)>=gradientScaled;reachedBoth=reached1&&reached2;if(!reached1){uv1-=offset*QUALITY(i);}if(!reached2){uv2+=offset*QUALITY(i);}if(reachedBoth){break;}}}float distance1=isHorizontal?(uv.x-uv1.x):(uv.y-uv1.y);float distance2=isHorizontal?(uv2.x-uv.x):(uv2.y-uv.y);bool isDirection1=distance1<distance2;float distanceFinal=min(distance1,distance2);float edgeThickness=(distance1+distance2);bool isLumaCenterSmaller=lumaCenter<lumaLocalAverage;bool correctVariation1=(lumaEnd1<0.0)!=isLumaCenterSmaller;bool correctVariation2=(lumaEnd2<0.0)!=isLumaCenterSmaller;bool correctVariation=isDirection1?correctVariation1:correctVariation2;float pixelOffset=-distanceFinal/edgeThickness+0.5;float finalOffset=correctVariation?pixelOffset:0.0;float lumaAverage=ONE_OVER_TWELVE*(2.0*(lumaDownUp+lumaLeftRight)+lumaLeftCorners+lumaRightCorners);float subPixelOffset1=clamp(abs(lumaAverage-lumaCenter)/lumaRange,0.0,1.0);float subPixelOffset2=(-2.0*subPixelOffset1+3.0)*subPixelOffset1*subPixelOffset1;float subPixelOffsetFinal=subPixelOffset2*subPixelOffset2*SUBPIXEL_QUALITY;finalOffset=max(finalOffset,subPixelOffsetFinal);vec2 finalUv=uv;if(isHorizontal){finalUv.y+=finalOffset*stepLength;}else{finalUv.x+=finalOffset*stepLength;}return texture2D(inputBuffer,finalUv);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=fxaa(inputColor,uv);}";

// src/effects/glsl/fxaa.vert
var fxaa_default2 = "varying vec2 vUvDown;varying vec2 vUvUp;varying vec2 vUvLeft;varying vec2 vUvRight;varying vec2 vUvDownLeft;varying vec2 vUvUpRight;varying vec2 vUvUpLeft;varying vec2 vUvDownRight;void mainSupport(const in vec2 uv){vUvDown=uv+vec2(0.0,-1.0)*texelSize;vUvUp=uv+vec2(0.0,1.0)*texelSize;vUvRight=uv+vec2(1.0,0.0)*texelSize;vUvLeft=uv+vec2(-1.0,0.0)*texelSize;vUvDownLeft=uv+vec2(-1.0,-1.0)*texelSize;vUvUpRight=uv+vec2(1.0,1.0)*texelSize;vUvUpLeft=uv+vec2(-1.0,1.0)*texelSize;vUvDownRight=uv+vec2(1.0,-1.0)*texelSize;}";

// src/effects/FXAAEffect.js
var FXAAEffect = class extends Effect {
  /**
   * Constructs a new FXAA effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   */
  constructor({ blendFunction = BlendFunction.SRC } = {}) {
    super("FXAAEffect", fxaa_default, {
      vertexShader: fxaa_default2,
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["EDGE_THRESHOLD_MIN", "0.0312"],
        ["EDGE_THRESHOLD_MAX", "0.125"],
        ["SUBPIXEL_QUALITY", "0.75"],
        ["SAMPLES", "12"]
      ])
    });
  }
  /**
   * The minimum edge detection threshold. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get minEdgeThreshold() {
    return Number(this.defines.get("EDGE_THRESHOLD_MIN"));
  }
  set minEdgeThreshold(value) {
    this.defines.set("EDGE_THRESHOLD_MIN", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The maximum edge detection threshold. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get maxEdgeThreshold() {
    return Number(this.defines.get("EDGE_THRESHOLD_MAX"));
  }
  set maxEdgeThreshold(value) {
    this.defines.set("EDGE_THRESHOLD_MAX", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The subpixel blend quality. Range is [0.0, 1.0].
   *
   * @type {Number}
   */
  get subpixelQuality() {
    return Number(this.defines.get("SUBPIXEL_QUALITY"));
  }
  set subpixelQuality(value) {
    this.defines.set("SUBPIXEL_QUALITY", value.toFixed(12));
    this.setChanged();
  }
  /**
   * The maximum amount of edge detection samples.
   *
   * @type {Number}
   */
  get samples() {
    return Number(this.defines.get("SAMPLES"));
  }
  set samples(value) {
    this.defines.set("SAMPLES", value.toFixed(0));
    this.setChanged();
  }
};

// src/effects/GammaCorrectionEffect.js
import { Uniform as Uniform31 } from "three";

// src/effects/glsl/gamma-correction.frag
var gamma_correction_default = "uniform float gamma;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=LinearToGamma(max(inputColor,0.0),gamma);}";

// src/effects/GammaCorrectionEffect.js
var GammaCorrectionEffect = class extends Effect {
  /**
   * Constructs a new gamma correction effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Number} [options.gamma=2.0] - The gamma factor.
   */
  constructor({ blendFunction = BlendFunction.SRC, gamma = 2 } = {}) {
    super("GammaCorrectionEffect", gamma_correction_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["gamma", new Uniform31(gamma)]
      ])
    });
  }
};

// src/effects/GlitchEffect.js
import { NearestFilter as NearestFilter6, RepeatWrapping, RGBAFormat as RGBAFormat3, Uniform as Uniform32, Vector2 as Vector220 } from "three";

// src/textures/lut/LookupTexture.js
import {
  Color as Color4,
  ClampToEdgeWrapping,
  DataTexture,
  Data3DTexture,
  FloatType as FloatType4,
  LinearFilter as LinearFilter3,
  RGBAFormat,
  UnsignedByteType as UnsignedByteType13,
  Vector3
} from "three";

// src/textures/RawImageData.js
function createCanvas(width, height, data) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  if (data instanceof Image) {
    context.drawImage(data, 0, 0);
  } else {
    const imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);
  }
  return canvas;
}
var RawImageData = class _RawImageData {
  /**
   * Constructs a new image data container.
   *
   * @param {Number} [width=0] - The width of the image.
   * @param {Number} [height=0] - The height of the image.
   * @param {Uint8ClampedArray} [data=null] - The image data.
   */
  constructor(width = 0, height = 0, data = null) {
    this.width = width;
    this.height = height;
    this.data = data;
  }
  /**
   * Creates a canvas from this image data.
   *
   * @return {Canvas} The canvas, or null if it couldn't be created.
   */
  toCanvas() {
    return typeof document === "undefined" ? null : createCanvas(this.width, this.height, this.data);
  }
  /**
   * Creates a new image data container.
   *
   * @param {ImageData|Image} image - An image or plain image data.
   * @return {RawImageData} The image data.
   */
  static from(image) {
    const { width, height } = image;
    let data;
    if (image instanceof Image) {
      const canvas = createCanvas(width, height, image);
      if (canvas !== null) {
        const context = canvas.getContext("2d");
        data = context.getImageData(0, 0, width, height).data;
      }
    } else {
      data = image.data;
    }
    return new _RawImageData(width, height, data);
  }
};

// tmp/lut/worker.txt
var worker_default = '"use strict";(()=>{var O={SCALE_UP:"lut.scaleup"};var _=[new Float32Array(3),new Float32Array(3)],n=[new Float32Array(3),new Float32Array(3),new Float32Array(3),new Float32Array(3)],Z=[[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1])]];function d(a,t,r,m){let i=r[0]-t[0],e=r[1]-t[1],y=r[2]-t[2],h=a[0]-t[0],A=a[1]-t[1],w=a[2]-t[2],c=e*w-y*A,l=y*h-i*w,x=i*A-e*h,u=Math.sqrt(c*c+l*l+x*x),b=u*.5,s=c/u,F=l/u,f=x/u,p=-(a[0]*s+a[1]*F+a[2]*f),M=m[0]*s+m[1]*F+m[2]*f;return Math.abs(M+p)*b/3}function V(a,t,r,m,i,e){let y=(r+m*t+i*t*t)*4;e[0]=a[y+0],e[1]=a[y+1],e[2]=a[y+2]}function k(a,t,r,m,i,e){let y=r*(t-1),h=m*(t-1),A=i*(t-1),w=Math.floor(y),c=Math.floor(h),l=Math.floor(A),x=Math.ceil(y),u=Math.ceil(h),b=Math.ceil(A),s=y-w,F=h-c,f=A-l;if(w===y&&c===h&&l===A)V(a,t,y,h,A,e);else{let p;s>=F&&F>=f?p=Z[0]:s>=f&&f>=F?p=Z[1]:f>=s&&s>=F?p=Z[2]:F>=s&&s>=f?p=Z[3]:F>=f&&f>=s?p=Z[4]:f>=F&&F>=s&&(p=Z[5]);let[M,g,X,Y]=p,P=_[0];P[0]=s,P[1]=F,P[2]=f;let o=_[1],L=x-w,S=u-c,U=b-l;o[0]=L*M[0]+w,o[1]=S*M[1]+c,o[2]=U*M[2]+l,V(a,t,o[0],o[1],o[2],n[0]),o[0]=L*g[0]+w,o[1]=S*g[1]+c,o[2]=U*g[2]+l,V(a,t,o[0],o[1],o[2],n[1]),o[0]=L*X[0]+w,o[1]=S*X[1]+c,o[2]=U*X[2]+l,V(a,t,o[0],o[1],o[2],n[2]),o[0]=L*Y[0]+w,o[1]=S*Y[1]+c,o[2]=U*Y[2]+l,V(a,t,o[0],o[1],o[2],n[3]);let T=d(g,X,Y,P)*6,q=d(M,X,Y,P)*6,C=d(M,g,Y,P)*6,E=d(M,g,X,P)*6;n[0][0]*=T,n[0][1]*=T,n[0][2]*=T,n[1][0]*=q,n[1][1]*=q,n[1][2]*=q,n[2][0]*=C,n[2][1]*=C,n[2][2]*=C,n[3][0]*=E,n[3][1]*=E,n[3][2]*=E,e[0]=n[0][0]+n[1][0]+n[2][0]+n[3][0],e[1]=n[0][1]+n[1][1]+n[2][1]+n[3][1],e[2]=n[0][2]+n[1][2]+n[2][2]+n[3][2]}}var v=class{static expand(t,r){let m=Math.cbrt(t.length/4),i=new Float32Array(3),e=new t.constructor(r**3*4),y=t instanceof Uint8Array?255:1,h=r**2,A=1/(r-1);for(let w=0;w<r;++w)for(let c=0;c<r;++c)for(let l=0;l<r;++l){let x=l*A,u=c*A,b=w*A,s=Math.round(l+c*r+w*h)*4;k(t,m,x,u,b,i),e[s+0]=i[0],e[s+1]=i[1],e[s+2]=i[2],e[s+3]=y}return e}};self.addEventListener("message",a=>{let t=a.data,r=t.data;switch(t.operation){case O.SCALE_UP:r=v.expand(r,t.size);break}postMessage(r,[r.buffer]),close()});})();\n';

// src/textures/lut/LookupTexture.js
var c = /* @__PURE__ */ new Color4();
var LookupTexture = class _LookupTexture extends Data3DTexture {
  /**
   * Constructs a cubic 3D lookup texture.
   *
   * @param {TypedArray} data - The pixel data. The default format is RGBA.
   * @param {Number} size - The sidelength.
   */
  constructor(data, size) {
    super(data, size, size, size);
    this.type = FloatType4;
    this.format = RGBAFormat;
    this.minFilter = LinearFilter3;
    this.magFilter = LinearFilter3;
    this.wrapS = ClampToEdgeWrapping;
    this.wrapT = ClampToEdgeWrapping;
    this.wrapR = ClampToEdgeWrapping;
    this.unpackAlignment = 1;
    this.needsUpdate = true;
    setTextureColorSpace(this, LinearSRGBColorSpace);
    this.domainMin = new Vector3(0, 0, 0);
    this.domainMax = new Vector3(1, 1, 1);
  }
  /**
   * Indicates that this is an instance of LookupTexture3D.
   *
   * @type {Boolean}
   * @deprecated
   */
  get isLookupTexture3D() {
    return true;
  }
  /**
   * Scales this LUT up to a given target size using tetrahedral interpolation.
   *
   * @param {Number} size - The target sidelength.
   * @param {Boolean} [transferData=true] - Extra fast mode. Set to false to keep the original data intact.
   * @return {Promise<LookupTexture>} A promise that resolves with a new LUT upon completion.
   */
  scaleUp(size, transferData = true) {
    const image = this.image;
    let promise;
    if (size <= image.width) {
      promise = Promise.reject(new Error("The target size must be greater than the current size"));
    } else {
      promise = new Promise((resolve, reject) => {
        const workerURL = URL.createObjectURL(new Blob([worker_default], {
          type: "text/javascript"
        }));
        const worker = new Worker(workerURL);
        worker.addEventListener("error", (event) => reject(event.error));
        worker.addEventListener("message", (event) => {
          const lut = new _LookupTexture(event.data, size);
          copyTextureColorSpace(this, lut);
          lut.type = this.type;
          lut.name = this.name;
          URL.revokeObjectURL(workerURL);
          resolve(lut);
        });
        const transferList = transferData ? [image.data.buffer] : [];
        worker.postMessage({
          operation: LUTOperation.SCALE_UP,
          data: image.data,
          size
        }, transferList);
      });
    }
    return promise;
  }
  /**
   * Applies the given LUT to this one.
   *
   * @param {LookupTexture} lut - A LUT. Must have the same dimensions, type and format as this LUT.
   * @return {LookupTexture} This texture.
   */
  applyLUT(lut) {
    const img0 = this.image;
    const img1 = lut.image;
    const size0 = Math.min(img0.width, img0.height, img0.depth);
    const size1 = Math.min(img1.width, img1.height, img1.depth);
    if (size0 !== size1) {
      console.error("Size mismatch");
    } else if (lut.type !== FloatType4 || this.type !== FloatType4) {
      console.error("Both LUTs must be FloatType textures");
    } else if (lut.format !== RGBAFormat || this.format !== RGBAFormat) {
      console.error("Both LUTs must be RGBA textures");
    } else {
      const data0 = img0.data;
      const data1 = img1.data;
      const size = size0;
      const sizeSq = size ** 2;
      const s = size - 1;
      for (let i = 0, l = size ** 3; i < l; ++i) {
        const i4 = i * 4;
        const r = data0[i4 + 0] * s;
        const g = data0[i4 + 1] * s;
        const b = data0[i4 + 2] * s;
        const iRGB = Math.round(r + g * size + b * sizeSq) * 4;
        data0[i4 + 0] = data1[iRGB + 0];
        data0[i4 + 1] = data1[iRGB + 1];
        data0[i4 + 2] = data1[iRGB + 2];
      }
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts the LUT data into unsigned byte data.
   *
   * This is a lossy operation which should only be performed after all other transformations have been applied.
   *
   * @return {LookupTexture} This texture.
   */
  convertToUint8() {
    if (this.type === FloatType4) {
      const floatData = this.image.data;
      const uint8Data = new Uint8Array(floatData.length);
      for (let i = 0, l = floatData.length; i < l; ++i) {
        uint8Data[i] = floatData[i] * 255 + 0.5;
      }
      this.image.data = uint8Data;
      this.type = UnsignedByteType13;
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts the LUT data into float data.
   *
   * @return {LookupTexture} This texture.
   */
  convertToFloat() {
    if (this.type === UnsignedByteType13) {
      const uint8Data = this.image.data;
      const floatData = new Float32Array(uint8Data.length);
      for (let i = 0, l = uint8Data.length; i < l; ++i) {
        floatData[i] = uint8Data[i] / 255;
      }
      this.image.data = floatData;
      this.type = FloatType4;
      this.needsUpdate = true;
    }
    return this;
  }
  /**
   * Converts this LUT into RGBA data.
   *
   * @deprecated LUTs are RGBA by default since three r137.
   * @return {LookupTexture} This texture.
   */
  convertToRGBA() {
    console.warn("LookupTexture", "convertToRGBA() is deprecated, LUTs are now RGBA by default");
    return this;
  }
  /**
   * Converts the output of this LUT into sRGB color space.
   *
   * @return {LookupTexture} This texture.
   */
  convertLinearToSRGB() {
    const data = this.image.data;
    if (this.type === FloatType4) {
      for (let i = 0, l = data.length; i < l; i += 4) {
        c.fromArray(data, i).convertLinearToSRGB().toArray(data, i);
      }
      setTextureColorSpace(this, SRGBColorSpace);
      this.needsUpdate = true;
    } else {
      console.error("Color space conversion requires FloatType data");
    }
    return this;
  }
  /**
   * Converts the output of this LUT into linear color space.
   *
   * @return {LookupTexture} This texture.
   */
  convertSRGBToLinear() {
    const data = this.image.data;
    if (this.type === FloatType4) {
      for (let i = 0, l = data.length; i < l; i += 4) {
        c.fromArray(data, i).convertSRGBToLinear().toArray(data, i);
      }
      setTextureColorSpace(this, LinearSRGBColorSpace);
      this.needsUpdate = true;
    } else {
      console.error("Color space conversion requires FloatType data");
    }
    return this;
  }
  /**
   * Converts this LUT into a 2D data texture.
   *
   * Please note that custom input domains are not carried over to 2D textures.
   *
   * @return {DataTexture} The texture.
   */
  toDataTexture() {
    const width = this.image.width;
    const height = this.image.height * this.image.depth;
    const texture = new DataTexture(this.image.data, width, height);
    texture.name = this.name;
    texture.type = this.type;
    texture.format = this.format;
    texture.minFilter = LinearFilter3;
    texture.magFilter = LinearFilter3;
    texture.wrapS = this.wrapS;
    texture.wrapT = this.wrapT;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    copyTextureColorSpace(this, texture);
    return texture;
  }
  /**
   * Creates a new 3D LUT by copying a given LUT.
   *
   * Common image-based textures will be converted into 3D data textures.
   *
   * @param {Texture} texture - The LUT. Assumed to be cubic.
   * @return {LookupTexture} A new 3D LUT.
   */
  static from(texture) {
    const image = texture.image;
    const { width, height } = image;
    const size = Math.min(width, height);
    let data;
    if (image instanceof Image) {
      const rawImageData = RawImageData.from(image);
      const src = rawImageData.data;
      if (width > height) {
        data = new Uint8Array(src.length);
        for (let z = 0; z < size; ++z) {
          for (let y = 0; y < size; ++y) {
            for (let x = 0; x < size; ++x) {
              const i4 = (x + z * size + y * size * size) * 4;
              const j4 = (x + y * size + z * size * size) * 4;
              data[j4 + 0] = src[i4 + 0];
              data[j4 + 1] = src[i4 + 1];
              data[j4 + 2] = src[i4 + 2];
              data[j4 + 3] = src[i4 + 3];
            }
          }
        }
      } else {
        data = new Uint8Array(src.buffer);
      }
    } else {
      data = image.data.slice();
    }
    const lut = new _LookupTexture(data, size);
    lut.type = texture.type;
    lut.name = texture.name;
    copyTextureColorSpace(texture, lut);
    return lut;
  }
  /**
   * Creates a neutral 3D LUT.
   *
   * @param {Number} size - The sidelength.
   * @return {LookupTexture} A neutral 3D LUT.
   */
  static createNeutral(size) {
    const data = new Float32Array(size ** 3 * 4);
    const sizeSq = size ** 2;
    const s = 1 / (size - 1);
    for (let r = 0; r < size; ++r) {
      for (let g = 0; g < size; ++g) {
        for (let b = 0; b < size; ++b) {
          const i4 = (r + g * size + b * sizeSq) * 4;
          data[i4 + 0] = r * s;
          data[i4 + 1] = g * s;
          data[i4 + 2] = b * s;
          data[i4 + 3] = 1;
        }
      }
    }
    const lut = new _LookupTexture(data, size);
    lut.name = "neutral";
    return lut;
  }
};

// src/textures/lut/TetrahedralUpscaler.js
var P = [
  new Float32Array(3),
  new Float32Array(3)
];
var C = [
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3),
  new Float32Array(3)
];
var T = [
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([1, 0, 0]),
    new Float32Array([1, 1, 0]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([1, 0, 0]),
    new Float32Array([1, 0, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 0, 1]),
    new Float32Array([1, 0, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, 0]),
    new Float32Array([1, 1, 0]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, 0]),
    new Float32Array([0, 1, 1]),
    new Float32Array([1, 1, 1])
  ],
  [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 0, 1]),
    new Float32Array([0, 1, 1]),
    new Float32Array([1, 1, 1])
  ]
];
function calculateTetrahedronVolume(a, b, c2, d) {
  const bcX = c2[0] - b[0];
  const bcY = c2[1] - b[1];
  const bcZ = c2[2] - b[2];
  const baX = a[0] - b[0];
  const baY = a[1] - b[1];
  const baZ = a[2] - b[2];
  const crossX = bcY * baZ - bcZ * baY;
  const crossY = bcZ * baX - bcX * baZ;
  const crossZ = bcX * baY - bcY * baX;
  const length = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
  const triangleArea = length * 0.5;
  const normalX = crossX / length;
  const normalY = crossY / length;
  const normalZ = crossZ / length;
  const constant = -(a[0] * normalX + a[1] * normalY + a[2] * normalZ);
  const dot = d[0] * normalX + d[1] * normalY + d[2] * normalZ;
  const height = Math.abs(dot + constant);
  return height * triangleArea / 3;
}
function sample(data, size, x, y, z, color2) {
  const i4 = (x + y * size + z * size * size) * 4;
  color2[0] = data[i4 + 0];
  color2[1] = data[i4 + 1];
  color2[2] = data[i4 + 2];
}
function tetrahedralSample(data, size, u, v3, w, color2) {
  const px = u * (size - 1);
  const py = v3 * (size - 1);
  const pz = w * (size - 1);
  const minX = Math.floor(px);
  const minY = Math.floor(py);
  const minZ = Math.floor(pz);
  const maxX = Math.ceil(px);
  const maxY = Math.ceil(py);
  const maxZ = Math.ceil(pz);
  const su = px - minX;
  const sv = py - minY;
  const sw = pz - minZ;
  if (minX === px && minY === py && minZ === pz) {
    sample(data, size, px, py, pz, color2);
  } else {
    let vertices;
    if (su >= sv && sv >= sw) {
      vertices = T[0];
    } else if (su >= sw && sw >= sv) {
      vertices = T[1];
    } else if (sw >= su && su >= sv) {
      vertices = T[2];
    } else if (sv >= su && su >= sw) {
      vertices = T[3];
    } else if (sv >= sw && sw >= su) {
      vertices = T[4];
    } else if (sw >= sv && sv >= su) {
      vertices = T[5];
    }
    const [P0, P1, P2, P3] = vertices;
    const coords = P[0];
    coords[0] = su;
    coords[1] = sv;
    coords[2] = sw;
    const tmp = P[1];
    const diffX = maxX - minX;
    const diffY = maxY - minY;
    const diffZ = maxZ - minZ;
    tmp[0] = diffX * P0[0] + minX;
    tmp[1] = diffY * P0[1] + minY;
    tmp[2] = diffZ * P0[2] + minZ;
    sample(data, size, tmp[0], tmp[1], tmp[2], C[0]);
    tmp[0] = diffX * P1[0] + minX;
    tmp[1] = diffY * P1[1] + minY;
    tmp[2] = diffZ * P1[2] + minZ;
    sample(data, size, tmp[0], tmp[1], tmp[2], C[1]);
    tmp[0] = diffX * P2[0] + minX;
    tmp[1] = diffY * P2[1] + minY;
    tmp[2] = diffZ * P2[2] + minZ;
    sample(data, size, tmp[0], tmp[1], tmp[2], C[2]);
    tmp[0] = diffX * P3[0] + minX;
    tmp[1] = diffY * P3[1] + minY;
    tmp[2] = diffZ * P3[2] + minZ;
    sample(data, size, tmp[0], tmp[1], tmp[2], C[3]);
    const V0 = calculateTetrahedronVolume(P1, P2, P3, coords) * 6;
    const V1 = calculateTetrahedronVolume(P0, P2, P3, coords) * 6;
    const V2 = calculateTetrahedronVolume(P0, P1, P3, coords) * 6;
    const V3 = calculateTetrahedronVolume(P0, P1, P2, coords) * 6;
    C[0][0] *= V0;
    C[0][1] *= V0;
    C[0][2] *= V0;
    C[1][0] *= V1;
    C[1][1] *= V1;
    C[1][2] *= V1;
    C[2][0] *= V2;
    C[2][1] *= V2;
    C[2][2] *= V2;
    C[3][0] *= V3;
    C[3][1] *= V3;
    C[3][2] *= V3;
    color2[0] = C[0][0] + C[1][0] + C[2][0] + C[3][0];
    color2[1] = C[0][1] + C[1][1] + C[2][1] + C[3][1];
    color2[2] = C[0][2] + C[1][2] + C[2][2] + C[3][2];
  }
}
var TetrahedralUpscaler = class {
  /**
   * Expands the given data to the target size.
   *
   * @param {TypedArray} data - The input RGBA data. Assumed to be cubic.
   * @param {Number} size - The target size.
   * @return {TypedArray} The new data.
   */
  static expand(data, size) {
    const originalSize = Math.cbrt(data.length / 4);
    const rgb = new Float32Array(3);
    const array = new data.constructor(size ** 3 * 4);
    const maxValue = data instanceof Uint8Array ? 255 : 1;
    const sizeSq = size ** 2;
    const s = 1 / (size - 1);
    for (let z = 0; z < size; ++z) {
      for (let y = 0; y < size; ++y) {
        for (let x = 0; x < size; ++x) {
          const u = x * s;
          const v3 = y * s;
          const w = z * s;
          const i4 = Math.round(x + y * size + z * sizeSq) * 4;
          tetrahedralSample(data, originalSize, u, v3, w, rgb);
          array[i4 + 0] = rgb[0];
          array[i4 + 1] = rgb[1];
          array[i4 + 2] = rgb[2];
          array[i4 + 3] = maxValue;
        }
      }
    }
    return array;
  }
};

// src/textures/smaa/SMAAAreaImageData.js
var area = [
  new Float32Array(2),
  new Float32Array(2)
];
var ORTHOGONAL_SIZE = 16;
var DIAGONAL_SIZE = 20;
var DIAGONAL_SAMPLES = 30;
var SMOOTH_MAX_DISTANCE = 32;
var orthogonalSubsamplingOffsets = new Float32Array([
  0,
  -0.25,
  0.25,
  -0.125,
  0.125,
  -0.375,
  0.375
]);
var diagonalSubsamplingOffsets = [
  new Float32Array([0, 0]),
  new Float32Array([0.25, -0.25]),
  new Float32Array([-0.25, 0.25]),
  new Float32Array([0.125, -0.125]),
  new Float32Array([-0.125, 0.125])
];
var orthogonalEdges = [
  new Uint8Array([0, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([0, 3]),
  new Uint8Array([3, 3]),
  new Uint8Array([1, 0]),
  new Uint8Array([4, 0]),
  new Uint8Array([1, 3]),
  new Uint8Array([4, 3]),
  new Uint8Array([0, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([0, 4]),
  new Uint8Array([3, 4]),
  new Uint8Array([1, 1]),
  new Uint8Array([4, 1]),
  new Uint8Array([1, 4]),
  new Uint8Array([4, 4])
];
var diagonalEdges = [
  new Uint8Array([0, 0]),
  new Uint8Array([1, 0]),
  new Uint8Array([0, 2]),
  new Uint8Array([1, 2]),
  new Uint8Array([2, 0]),
  new Uint8Array([3, 0]),
  new Uint8Array([2, 2]),
  new Uint8Array([3, 2]),
  new Uint8Array([0, 1]),
  new Uint8Array([1, 1]),
  new Uint8Array([0, 3]),
  new Uint8Array([1, 3]),
  new Uint8Array([2, 1]),
  new Uint8Array([3, 1]),
  new Uint8Array([2, 3]),
  new Uint8Array([3, 3])
];
function lerp(a, b, p) {
  return a + (b - a) * p;
}
function saturate(a) {
  return Math.min(Math.max(a, 0), 1);
}
function smoothArea(d) {
  const a1 = area[0];
  const a2 = area[1];
  const b1X = Math.sqrt(a1[0] * 2) * 0.5;
  const b1Y = Math.sqrt(a1[1] * 2) * 0.5;
  const b2X = Math.sqrt(a2[0] * 2) * 0.5;
  const b2Y = Math.sqrt(a2[1] * 2) * 0.5;
  const p = saturate(d / SMOOTH_MAX_DISTANCE);
  a1[0] = lerp(b1X, a1[0], p);
  a1[1] = lerp(b1Y, a1[1], p);
  a2[0] = lerp(b2X, a2[0], p);
  a2[1] = lerp(b2Y, a2[1], p);
}
function getOrthArea(p1X, p1Y, p2X, p2Y, x, result) {
  const dX = p2X - p1X;
  const dY = p2Y - p1Y;
  const x1 = x;
  const x2 = x + 1;
  const y1 = p1Y + dY * (x1 - p1X) / dX;
  const y2 = p1Y + dY * (x2 - p1X) / dX;
  if (x1 >= p1X && x1 < p2X || x2 > p1X && x2 <= p2X) {
    if (Math.sign(y1) === Math.sign(y2) || Math.abs(y1) < 1e-4 || Math.abs(y2) < 1e-4) {
      const a = (y1 + y2) / 2;
      if (a < 0) {
        result[0] = Math.abs(a);
        result[1] = 0;
      } else {
        result[0] = 0;
        result[1] = Math.abs(a);
      }
    } else {
      const t = -p1Y * dX / dY + p1X;
      const tInt = Math.trunc(t);
      const a1 = t > p1X ? y1 * (t - tInt) / 2 : 0;
      const a2 = t < p2X ? y2 * (1 - (t - tInt)) / 2 : 0;
      const a = Math.abs(a1) > Math.abs(a2) ? a1 : -a2;
      if (a < 0) {
        result[0] = Math.abs(a1);
        result[1] = Math.abs(a2);
      } else {
        result[0] = Math.abs(a2);
        result[1] = Math.abs(a1);
      }
    }
  } else {
    result[0] = 0;
    result[1] = 0;
  }
  return result;
}
function getOrthAreaForPattern(pattern, left, right, offset, result) {
  const a1 = area[0];
  const a2 = area[1];
  const o1 = 0.5 + offset;
  const o2 = 0.5 + offset - 1;
  const d = left + right + 1;
  switch (pattern) {
    case 0: {
      result[0] = 0;
      result[1] = 0;
      break;
    }
    case 1: {
      if (left <= right) {
        getOrthArea(0, o2, d / 2, 0, left, result);
      } else {
        result[0] = 0;
        result[1] = 0;
      }
      break;
    }
    case 2: {
      if (left >= right) {
        getOrthArea(d / 2, 0, d, o2, left, result);
      } else {
        result[0] = 0;
        result[1] = 0;
      }
      break;
    }
    case 3: {
      getOrthArea(0, o2, d / 2, 0, left, a1);
      getOrthArea(d / 2, 0, d, o2, left, a2);
      smoothArea(d, area);
      result[0] = a1[0] + a2[0];
      result[1] = a1[1] + a2[1];
      break;
    }
    case 4: {
      if (left <= right) {
        getOrthArea(0, o1, d / 2, 0, left, result);
      } else {
        result[0] = 0;
        result[1] = 0;
      }
      break;
    }
    case 5: {
      result[0] = 0;
      result[1] = 0;
      break;
    }
    case 6: {
      if (Math.abs(offset) > 0) {
        getOrthArea(0, o1, d, o2, left, a1);
        getOrthArea(0, o1, d / 2, 0, left, a2);
        getOrthArea(d / 2, 0, d, o2, left, result);
        a2[0] = a2[0] + result[0];
        a2[1] = a2[1] + result[1];
        result[0] = (a1[0] + a2[0]) / 2;
        result[1] = (a1[1] + a2[1]) / 2;
      } else {
        getOrthArea(0, o1, d, o2, left, result);
      }
      break;
    }
    case 7: {
      getOrthArea(0, o1, d, o2, left, result);
      break;
    }
    case 8: {
      if (left >= right) {
        getOrthArea(d / 2, 0, d, o1, left, result);
      } else {
        result[0] = 0;
        result[1] = 0;
      }
      break;
    }
    case 9: {
      if (Math.abs(offset) > 0) {
        getOrthArea(0, o2, d, o1, left, a1);
        getOrthArea(0, o2, d / 2, 0, left, a2);
        getOrthArea(d / 2, 0, d, o1, left, result);
        a2[0] = a2[0] + result[0];
        a2[1] = a2[1] + result[1];
        result[0] = (a1[0] + a2[0]) / 2;
        result[1] = (a1[1] + a2[1]) / 2;
      } else {
        getOrthArea(0, o2, d, o1, left, result);
      }
      break;
    }
    case 10: {
      result[0] = 0;
      result[1] = 0;
      break;
    }
    case 11: {
      getOrthArea(0, o2, d, o1, left, result);
      break;
    }
    case 12: {
      getOrthArea(0, o1, d / 2, 0, left, a1);
      getOrthArea(d / 2, 0, d, o1, left, a2);
      smoothArea(d, area);
      result[0] = a1[0] + a2[0];
      result[1] = a1[1] + a2[1];
      break;
    }
    case 13: {
      getOrthArea(0, o2, d, o1, left, result);
      break;
    }
    case 14: {
      getOrthArea(0, o1, d, o2, left, result);
      break;
    }
    case 15: {
      result[0] = 0;
      result[1] = 0;
      break;
    }
  }
  return result;
}
function isInsideArea(a1X, a1Y, a2X, a2Y, x, y) {
  let result = a1X === a2X && a1Y === a2Y;
  if (!result) {
    const xm = (a1X + a2X) / 2;
    const ym = (a1Y + a2Y) / 2;
    const a = a2Y - a1Y;
    const b = a1X - a2X;
    const c2 = a * (x - xm) + b * (y - ym);
    result = c2 > 0;
  }
  return result;
}
function getDiagAreaForPixel(a1X, a1Y, a2X, a2Y, pX, pY) {
  let n = 0;
  for (let y = 0; y < DIAGONAL_SAMPLES; ++y) {
    for (let x = 0; x < DIAGONAL_SAMPLES; ++x) {
      const offsetX = x / (DIAGONAL_SAMPLES - 1);
      const offsetY = y / (DIAGONAL_SAMPLES - 1);
      if (isInsideArea(a1X, a1Y, a2X, a2Y, pX + offsetX, pY + offsetY)) {
        ++n;
      }
    }
  }
  return n / (DIAGONAL_SAMPLES * DIAGONAL_SAMPLES);
}
function getDiagArea(pattern, a1X, a1Y, a2X, a2Y, left, offset, result) {
  const e = diagonalEdges[pattern];
  const e1 = e[0];
  const e2 = e[1];
  if (e1 > 0) {
    a1X += offset[0];
    a1Y += offset[1];
  }
  if (e2 > 0) {
    a2X += offset[0];
    a2Y += offset[1];
  }
  result[0] = 1 - getDiagAreaForPixel(a1X, a1Y, a2X, a2Y, 1 + left, 0 + left);
  result[1] = getDiagAreaForPixel(a1X, a1Y, a2X, a2Y, 1 + left, 1 + left);
  return result;
}
function getDiagAreaForPattern(pattern, left, right, offset, result) {
  const a1 = area[0];
  const a2 = area[1];
  const d = left + right + 1;
  switch (pattern) {
    case 0: {
      getDiagArea(pattern, 1, 1, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 1: {
      getDiagArea(pattern, 1, 0, 0 + d, 0 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 2: {
      getDiagArea(pattern, 0, 0, 1 + d, 0 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 3: {
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, result);
      break;
    }
    case 4: {
      getDiagArea(pattern, 1, 1, 0 + d, 0 + d, left, offset, a1);
      getDiagArea(pattern, 1, 1, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 5: {
      getDiagArea(pattern, 1, 1, 0 + d, 0 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 6: {
      getDiagArea(pattern, 1, 1, 1 + d, 0 + d, left, offset, result);
      break;
    }
    case 7: {
      getDiagArea(pattern, 1, 1, 1 + d, 0 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 8: {
      getDiagArea(pattern, 0, 0, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 1 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 9: {
      getDiagArea(pattern, 1, 0, 1 + d, 1 + d, left, offset, result);
      getDiagArea(pattern, 1, 0, 1 + d, 1 + d, left, offset, result);
      break;
    }
    case 10: {
      getDiagArea(pattern, 0, 0, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 11: {
      getDiagArea(pattern, 1, 0, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 12: {
      getDiagArea(pattern, 1, 1, 1 + d, 1 + d, left, offset, result);
      break;
    }
    case 13: {
      getDiagArea(pattern, 1, 1, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 1 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 14: {
      getDiagArea(pattern, 1, 1, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 1, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
    case 15: {
      getDiagArea(pattern, 1, 1, 1 + d, 1 + d, left, offset, a1);
      getDiagArea(pattern, 1, 0, 1 + d, 0 + d, left, offset, a2);
      result[0] = (a1[0] + a2[0]) / 2;
      result[1] = (a1[1] + a2[1]) / 2;
      break;
    }
  }
  return result;
}
function generatePatterns(patterns, offset, orthogonal) {
  const result = new Float32Array(2);
  for (let i = 0, l = patterns.length; i < l; ++i) {
    const pattern = patterns[i];
    const data = pattern.data;
    const size = pattern.width;
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        if (orthogonal) {
          getOrthAreaForPattern(i, x, y, offset, result);
        } else {
          getDiagAreaForPattern(i, x, y, offset, result);
        }
        const c2 = (y * size + x) * 2;
        data[c2] = result[0] * 255;
        data[c2 + 1] = result[1] * 255;
      }
    }
  }
}
function assemble(baseX, baseY, patterns, edges2, size, orthogonal, target) {
  const dstData = target.data;
  const dstWidth = target.width;
  for (let i = 0, l = patterns.length; i < l; ++i) {
    const edge = edges2[i];
    const pattern = patterns[i];
    const srcData = pattern.data;
    const srcWidth = pattern.width;
    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        const pX = edge[0] * size + baseX + x;
        const pY = edge[1] * size + baseY + y;
        const c2 = (pY * dstWidth + pX) * 4;
        const d = orthogonal ? (y * y * srcWidth + x * x) * 2 : (y * srcWidth + x) * 2;
        dstData[c2] = srcData[d];
        dstData[c2 + 1] = srcData[d + 1];
        dstData[c2 + 2] = 0;
        dstData[c2 + 3] = 255;
      }
    }
  }
}
var SMAAAreaImageData = class {
  /**
   * Creates a new area image.
   *
   * @return {RawImageData} The generated image data.
   */
  static generate() {
    const width = 2 * 5 * ORTHOGONAL_SIZE;
    const height = orthogonalSubsamplingOffsets.length * 5 * ORTHOGONAL_SIZE;
    const data = new Uint8ClampedArray(width * height * 4);
    const result = new RawImageData(width, height, data);
    const orthPatternSize = Math.pow(ORTHOGONAL_SIZE - 1, 2) + 1;
    const diagPatternSize = DIAGONAL_SIZE;
    const orthogonalPatterns = [];
    const diagonalPatterns = [];
    for (let i = 3, l = data.length; i < l; i += 4) {
      data[i] = 255;
    }
    for (let i = 0; i < 16; ++i) {
      orthogonalPatterns.push(new RawImageData(
        orthPatternSize,
        orthPatternSize,
        new Uint8ClampedArray(orthPatternSize * orthPatternSize * 2),
        2
      ));
      diagonalPatterns.push(new RawImageData(
        diagPatternSize,
        diagPatternSize,
        new Uint8ClampedArray(diagPatternSize * diagPatternSize * 2),
        2
      ));
    }
    for (let i = 0, l = orthogonalSubsamplingOffsets.length; i < l; ++i) {
      generatePatterns(orthogonalPatterns, orthogonalSubsamplingOffsets[i], true);
      assemble(
        0,
        5 * ORTHOGONAL_SIZE * i,
        orthogonalPatterns,
        orthogonalEdges,
        ORTHOGONAL_SIZE,
        true,
        result
      );
    }
    for (let i = 0, l = diagonalSubsamplingOffsets.length; i < l; ++i) {
      generatePatterns(diagonalPatterns, diagonalSubsamplingOffsets[i], false);
      assemble(
        5 * ORTHOGONAL_SIZE,
        4 * DIAGONAL_SIZE * i,
        diagonalPatterns,
        diagonalEdges,
        DIAGONAL_SIZE,
        false,
        result
      );
    }
    return result;
  }
};

// src/textures/smaa/SMAAImageGenerator.js
import { LoadingManager } from "three";

// tmp/smaa/worker.txt
var worker_default2 = '"use strict";(()=>{function q(t,a,s){let e=document.createElement("canvas"),n=e.getContext("2d");if(e.width=t,e.height=a,s instanceof Image)n.drawImage(s,0,0);else{let r=n.createImageData(t,a);r.data.set(s),n.putImageData(r,0,0)}return e}var F=class t{constructor(a=0,s=0,e=null){this.width=a,this.height=s,this.data=e}toCanvas(){return typeof document=="undefined"?null:q(this.width,this.height,this.data)}static from(a){let{width:s,height:e}=a,n;if(a instanceof Image){let r=q(s,e,a);r!==null&&(n=r.getContext("2d").getImageData(0,0,s,e).data)}else n=a.data;return new t(s,e,n)}};var M=[new Float32Array(2),new Float32Array(2)],D=16,W=20,I=30,j=32,v=new Float32Array([0,-.25,.25,-.125,.125,-.375,.375]),N=[new Float32Array([0,0]),new Float32Array([.25,-.25]),new Float32Array([-.25,.25]),new Float32Array([.125,-.125]),new Float32Array([-.125,.125])],z=[new Uint8Array([0,0]),new Uint8Array([3,0]),new Uint8Array([0,3]),new Uint8Array([3,3]),new Uint8Array([1,0]),new Uint8Array([4,0]),new Uint8Array([1,3]),new Uint8Array([4,3]),new Uint8Array([0,1]),new Uint8Array([3,1]),new Uint8Array([0,4]),new Uint8Array([3,4]),new Uint8Array([1,1]),new Uint8Array([4,1]),new Uint8Array([1,4]),new Uint8Array([4,4])],p=[new Uint8Array([0,0]),new Uint8Array([1,0]),new Uint8Array([0,2]),new Uint8Array([1,2]),new Uint8Array([2,0]),new Uint8Array([3,0]),new Uint8Array([2,2]),new Uint8Array([3,2]),new Uint8Array([0,1]),new Uint8Array([1,1]),new Uint8Array([0,3]),new Uint8Array([1,3]),new Uint8Array([2,1]),new Uint8Array([3,1]),new Uint8Array([2,3]),new Uint8Array([3,3])];function C(t,a,s){return t+(a-t)*s}function B(t){return Math.min(Math.max(t,0),1)}function _(t){let a=M[0],s=M[1],e=Math.sqrt(a[0]*2)*.5,n=Math.sqrt(a[1]*2)*.5,r=Math.sqrt(s[0]*2)*.5,o=Math.sqrt(s[1]*2)*.5,c=B(t/j);a[0]=C(e,a[0],c),a[1]=C(n,a[1],c),s[0]=C(r,s[0],c),s[1]=C(o,s[1],c)}function d(t,a,s,e,n,r){let o=s-t,c=e-a,h=n,i=n+1,w=a+c*(h-t)/o,b=a+c*(i-t)/o;if(h>=t&&h<s||i>t&&i<=s)if(Math.sign(w)===Math.sign(b)||Math.abs(w)<1e-4||Math.abs(b)<1e-4){let g=(w+b)/2;g<0?(r[0]=Math.abs(g),r[1]=0):(r[0]=0,r[1]=Math.abs(g))}else{let g=-a*o/c+t,k=Math.trunc(g),m=g>t?w*(g-k)/2:0,U=g<s?b*(1-(g-k))/2:0;(Math.abs(m)>Math.abs(U)?m:-U)<0?(r[0]=Math.abs(m),r[1]=Math.abs(U)):(r[0]=Math.abs(U),r[1]=Math.abs(m))}else r[0]=0,r[1]=0;return r}function J(t,a,s,e,n){let r=M[0],o=M[1],c=.5+e,h=.5+e-1,i=a+s+1;switch(t){case 0:{n[0]=0,n[1]=0;break}case 1:{a<=s?d(0,h,i/2,0,a,n):(n[0]=0,n[1]=0);break}case 2:{a>=s?d(i/2,0,i,h,a,n):(n[0]=0,n[1]=0);break}case 3:{d(0,h,i/2,0,a,r),d(i/2,0,i,h,a,o),_(i,M),n[0]=r[0]+o[0],n[1]=r[1]+o[1];break}case 4:{a<=s?d(0,c,i/2,0,a,n):(n[0]=0,n[1]=0);break}case 5:{n[0]=0,n[1]=0;break}case 6:{Math.abs(e)>0?(d(0,c,i,h,a,r),d(0,c,i/2,0,a,o),d(i/2,0,i,h,a,n),o[0]=o[0]+n[0],o[1]=o[1]+n[1],n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2):d(0,c,i,h,a,n);break}case 7:{d(0,c,i,h,a,n);break}case 8:{a>=s?d(i/2,0,i,c,a,n):(n[0]=0,n[1]=0);break}case 9:{Math.abs(e)>0?(d(0,h,i,c,a,r),d(0,h,i/2,0,a,o),d(i/2,0,i,c,a,n),o[0]=o[0]+n[0],o[1]=o[1]+n[1],n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2):d(0,h,i,c,a,n);break}case 10:{n[0]=0,n[1]=0;break}case 11:{d(0,h,i,c,a,n);break}case 12:{d(0,c,i/2,0,a,r),d(i/2,0,i,c,a,o),_(i,M),n[0]=r[0]+o[0],n[1]=r[1]+o[1];break}case 13:{d(0,h,i,c,a,n);break}case 14:{d(0,c,i,h,a,n);break}case 15:{n[0]=0,n[1]=0;break}}return n}function K(t,a,s,e,n,r){let o=t===s&&a===e;if(!o){let c=(t+s)/2,h=(a+e)/2,i=e-a,w=t-s;o=i*(n-c)+w*(r-h)>0}return o}function G(t,a,s,e,n,r){let o=0;for(let c=0;c<I;++c)for(let h=0;h<I;++h){let i=h/(I-1),w=c/(I-1);K(t,a,s,e,n+i,r+w)&&++o}return o/(I*I)}function A(t,a,s,e,n,r,o,c){let h=p[t],i=h[0],w=h[1];return i>0&&(a+=o[0],s+=o[1]),w>0&&(e+=o[0],n+=o[1]),c[0]=1-G(a,s,e,n,1+r,0+r),c[1]=G(a,s,e,n,1+r,1+r),c}function Q(t,a,s,e,n){let r=M[0],o=M[1],c=a+s+1;switch(t){case 0:{A(t,1,1,1+c,1+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 1:{A(t,1,0,0+c,0+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 2:{A(t,0,0,1+c,0+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 3:{A(t,1,0,1+c,0+c,a,e,n);break}case 4:{A(t,1,1,0+c,0+c,a,e,r),A(t,1,1,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 5:{A(t,1,1,0+c,0+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 6:{A(t,1,1,1+c,0+c,a,e,n);break}case 7:{A(t,1,1,1+c,0+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 8:{A(t,0,0,1+c,1+c,a,e,r),A(t,1,0,1+c,1+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 9:{A(t,1,0,1+c,1+c,a,e,n),A(t,1,0,1+c,1+c,a,e,n);break}case 10:{A(t,0,0,1+c,1+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 11:{A(t,1,0,1+c,1+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 12:{A(t,1,1,1+c,1+c,a,e,n);break}case 13:{A(t,1,1,1+c,1+c,a,e,r),A(t,1,0,1+c,1+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 14:{A(t,1,1,1+c,1+c,a,e,r),A(t,1,1,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}case 15:{A(t,1,1,1+c,1+c,a,e,r),A(t,1,0,1+c,0+c,a,e,o),n[0]=(r[0]+o[0])/2,n[1]=(r[1]+o[1])/2;break}}return n}function R(t,a,s){let e=new Float32Array(2);for(let n=0,r=t.length;n<r;++n){let o=t[n],c=o.data,h=o.width;for(let i=0;i<h;++i)for(let w=0;w<h;++w){s?J(n,w,i,a,e):Q(n,w,i,a,e);let b=(i*h+w)*2;c[b]=e[0]*255,c[b+1]=e[1]*255}}}function T(t,a,s,e,n,r,o){let c=o.data,h=o.width;for(let i=0,w=s.length;i<w;++i){let b=e[i],g=s[i],k=g.data,m=g.width;for(let U=0;U<n;++U)for(let x=0;x<n;++x){let Z=b[0]*n+t+x,O=((b[1]*n+a+U)*h+Z)*4,L=r?(U*U*m+x*x)*2:(U*m+x)*2;c[O]=k[L],c[O+1]=k[L+1],c[O+2]=0,c[O+3]=255}}}var S=class{static generate(){let a=10*D,s=v.length*5*D,e=new Uint8ClampedArray(a*s*4),n=new F(a,s,e),r=Math.pow(D-1,2)+1,o=W,c=[],h=[];for(let i=3,w=e.length;i<w;i+=4)e[i]=255;for(let i=0;i<16;++i)c.push(new F(r,r,new Uint8ClampedArray(r*r*2),2)),h.push(new F(o,o,new Uint8ClampedArray(o*o*2),2));for(let i=0,w=v.length;i<w;++i)R(c,v[i],!0),T(0,5*D*i,c,z,D,!0,n);for(let i=0,w=N.length;i<w;++i)R(h,N[i],!1),T(5*D,4*W*i,h,p,W,!1,n);return n}};var P=new Map([[y(0,0,0,0),new Float32Array([0,0,0,0])],[y(0,0,0,1),new Float32Array([0,0,0,1])],[y(0,0,1,0),new Float32Array([0,0,1,0])],[y(0,0,1,1),new Float32Array([0,0,1,1])],[y(0,1,0,0),new Float32Array([0,1,0,0])],[y(0,1,0,1),new Float32Array([0,1,0,1])],[y(0,1,1,0),new Float32Array([0,1,1,0])],[y(0,1,1,1),new Float32Array([0,1,1,1])],[y(1,0,0,0),new Float32Array([1,0,0,0])],[y(1,0,0,1),new Float32Array([1,0,0,1])],[y(1,0,1,0),new Float32Array([1,0,1,0])],[y(1,0,1,1),new Float32Array([1,0,1,1])],[y(1,1,0,0),new Float32Array([1,1,0,0])],[y(1,1,0,1),new Float32Array([1,1,0,1])],[y(1,1,1,0),new Float32Array([1,1,1,0])],[y(1,1,1,1),new Float32Array([1,1,1,1])]]);function H(t,a,s){return t+(a-t)*s}function y(t,a,s,e){let n=H(t,a,.75),r=H(s,e,1-.25);return H(n,r,1-.125)}function V(t,a){let s=0;return a[3]===1&&(s+=1),s===1&&a[2]===1&&t[1]!==1&&t[3]!==1&&(s+=1),s}function $(t,a){let s=0;return a[3]===1&&t[1]!==1&&t[3]!==1&&(s+=1),s===1&&a[2]===1&&t[0]!==1&&t[2]!==1&&(s+=1),s}var E=class{static generate(){let o=new Uint8ClampedArray(2178),c=new Uint8ClampedArray(64*16*4);for(let h=0;h<33;++h)for(let i=0;i<66;++i){let w=.03125*i,b=.03125*h;if(P.has(w)&&P.has(b)){let g=P.get(w),k=P.get(b),m=h*66+i;o[m]=127*V(g,k),o[m+33]=127*$(g,k)}}for(let h=0,i=17;i<33;++i)for(let w=0;w<64;++w,h+=4)c[h]=o[i*66+w],c[h+3]=255;return new F(64,16,c)}};self.addEventListener("message",t=>{let a=S.generate(),s=E.generate();postMessage({areaImageData:a,searchImageData:s},[a.data.buffer,s.data.buffer]),close()});})();\n';

// src/textures/smaa/SMAAImageGenerator.js
function generate(useCache = true) {
  const workerURL = URL.createObjectURL(new Blob([worker_default2], {
    type: "text/javascript"
  }));
  const worker = new Worker(workerURL);
  URL.revokeObjectURL(workerURL);
  return new Promise((resolve, reject) => {
    worker.addEventListener("error", (event) => reject(event.error));
    worker.addEventListener("message", (event) => {
      const searchImageData = RawImageData.from(event.data.searchImageData);
      const areaImageData = RawImageData.from(event.data.areaImageData);
      const urls = [
        searchImageData.toCanvas().toDataURL("image/png", 1),
        areaImageData.toCanvas().toDataURL("image/png", 1)
      ];
      if (useCache) {
        localStorage.setItem("smaa-search", urls[0]);
        localStorage.setItem("smaa-area", urls[1]);
      }
      resolve(urls);
    });
    worker.postMessage(null);
  });
}
var SMAAImageGenerator = class {
  /**
   * Constructs a new SMAA image generator.
   */
  constructor() {
    this.disableCache = false;
  }
  /**
   * Enables or disables caching via localStorage.
   *
   * @param {Boolean} value - Whether the cache should be enabled.
   */
  setCacheEnabled(value) {
    this.disableCache = !value;
  }
  /**
   * Generates the SMAA data images.
   *
   * @example
   * SMAAImageGenerator.generate().then(([search, area]) => {
   *   const smaaEffect = new SMAAEffect(search, area);
   * });
   * @return {Promise<Image[]>} A promise that returns the search image and area image as a pair.
   */
  generate() {
    const useCache = !this.disableCache && window.localStorage !== void 0;
    const cachedURLs = useCache ? [
      localStorage.getItem("smaa-search"),
      localStorage.getItem("smaa-area")
    ] : [null, null];
    const promise = cachedURLs[0] !== null && cachedURLs[1] !== null ? Promise.resolve(cachedURLs) : generate(useCache);
    return promise.then((urls) => {
      return new Promise((resolve, reject) => {
        const searchImage = new Image();
        const areaImage = new Image();
        const manager = new LoadingManager();
        manager.onLoad = () => resolve([searchImage, areaImage]);
        manager.onError = reject;
        searchImage.addEventListener("error", (e) => manager.itemError("smaa-search"));
        areaImage.addEventListener("error", (e) => manager.itemError("smaa-area"));
        searchImage.addEventListener("load", () => manager.itemEnd("smaa-search"));
        areaImage.addEventListener("load", () => manager.itemEnd("smaa-area"));
        manager.itemStart("smaa-search");
        manager.itemStart("smaa-area");
        searchImage.src = urls[0];
        areaImage.src = urls[1];
      });
    });
  }
};

// src/textures/smaa/SMAASearchImageData.js
var edges = /* @__PURE__ */ new Map([
  [bilinear(0, 0, 0, 0), new Float32Array([0, 0, 0, 0])],
  [bilinear(0, 0, 0, 1), new Float32Array([0, 0, 0, 1])],
  [bilinear(0, 0, 1, 0), new Float32Array([0, 0, 1, 0])],
  [bilinear(0, 0, 1, 1), new Float32Array([0, 0, 1, 1])],
  [bilinear(0, 1, 0, 0), new Float32Array([0, 1, 0, 0])],
  [bilinear(0, 1, 0, 1), new Float32Array([0, 1, 0, 1])],
  [bilinear(0, 1, 1, 0), new Float32Array([0, 1, 1, 0])],
  [bilinear(0, 1, 1, 1), new Float32Array([0, 1, 1, 1])],
  [bilinear(1, 0, 0, 0), new Float32Array([1, 0, 0, 0])],
  [bilinear(1, 0, 0, 1), new Float32Array([1, 0, 0, 1])],
  [bilinear(1, 0, 1, 0), new Float32Array([1, 0, 1, 0])],
  [bilinear(1, 0, 1, 1), new Float32Array([1, 0, 1, 1])],
  [bilinear(1, 1, 0, 0), new Float32Array([1, 1, 0, 0])],
  [bilinear(1, 1, 0, 1), new Float32Array([1, 1, 0, 1])],
  [bilinear(1, 1, 1, 0), new Float32Array([1, 1, 1, 0])],
  [bilinear(1, 1, 1, 1), new Float32Array([1, 1, 1, 1])]
]);
function lerp2(a, b, p) {
  return a + (b - a) * p;
}
function bilinear(e0, e1, e2, e3) {
  const a = lerp2(e0, e1, 1 - 0.25);
  const b = lerp2(e2, e3, 1 - 0.25);
  return lerp2(a, b, 1 - 0.125);
}
function deltaLeft(left, top) {
  let d = 0;
  if (top[3] === 1) {
    d += 1;
  }
  if (d === 1 && top[2] === 1 && left[1] !== 1 && left[3] !== 1) {
    d += 1;
  }
  return d;
}
function deltaRight(left, top) {
  let d = 0;
  if (top[3] === 1 && left[1] !== 1 && left[3] !== 1) {
    d += 1;
  }
  if (d === 1 && top[2] === 1 && left[0] !== 1 && left[2] !== 1) {
    d += 1;
  }
  return d;
}
var SMAASearchImageData = class {
  /**
   * Creates a new search image.
   *
   * @return {RawImageData} The generated image data.
   */
  static generate() {
    const width = 66;
    const height = 33;
    const halfWidth = width / 2;
    const croppedWidth = 64;
    const croppedHeight = 16;
    const data = new Uint8ClampedArray(width * height);
    const croppedData = new Uint8ClampedArray(croppedWidth * croppedHeight * 4);
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const s = 0.03125 * x;
        const t = 0.03125 * y;
        if (edges.has(s) && edges.has(t)) {
          const e1 = edges.get(s);
          const e2 = edges.get(t);
          const i = y * width + x;
          data[i] = 127 * deltaLeft(e1, e2);
          data[i + halfWidth] = 127 * deltaRight(e1, e2);
        }
      }
    }
    for (let i = 0, y = height - croppedHeight; y < height; ++y) {
      for (let x = 0; x < croppedWidth; ++x, i += 4) {
        croppedData[i] = data[y * width + x];
        croppedData[i + 3] = 255;
      }
    }
    return new RawImageData(croppedWidth, croppedHeight, croppedData);
  }
};

// src/textures/NoiseTexture.js
import {
  DataTexture as DataTexture2,
  LuminanceFormat,
  RedFormat,
  RGFormat,
  RGBAFormat as RGBAFormat2,
  UnsignedByteType as UnsignedByteType14
} from "three";
function getNoise(size, format, type) {
  const channels = /* @__PURE__ */ new Map([
    [LuminanceFormat, 1],
    [RedFormat, 1],
    [RGFormat, 2],
    [RGBAFormat2, 4]
  ]);
  let data;
  if (!channels.has(format)) {
    console.error("Invalid noise texture format");
  }
  if (type === UnsignedByteType14) {
    data = new Uint8Array(size * channels.get(format));
    for (let i = 0, l = data.length; i < l; ++i) {
      data[i] = Math.random() * 255 + 0.5;
    }
  } else {
    data = new Float32Array(size * channels.get(format));
    for (let i = 0, l = data.length; i < l; ++i) {
      data[i] = Math.random();
    }
  }
  return data;
}
var NoiseTexture = class extends DataTexture2 {
  /**
   * Constructs a new noise texture.
   *
   * The texture format can be either `LuminanceFormat` or `RGBAFormat`. Additionally, the formats `RedFormat` and
   * `RGFormat` can be used in a WebGL 2 context.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   * @param {Number} [format=LuminanceFormat] - The texture format.
   * @param {Number} [type=UnsignedByteType] - The texture type.
   */
  constructor(width, height, format = LuminanceFormat, type = UnsignedByteType14) {
    super(getNoise(width * height, format, type), width, height, format, type);
    this.needsUpdate = true;
  }
};

// src/effects/glsl/glitch.frag
var glitch_default = "uniform lowp sampler2D perturbationMap;uniform bool active;uniform float columns;uniform float random;uniform vec2 seeds;uniform vec2 distortion;void mainUv(inout vec2 uv){if(active){if(uv.y<distortion.x+columns&&uv.y>distortion.x-columns*random){float sx=clamp(ceil(seeds.x),0.0,1.0);uv.y=sx*(1.0-(uv.y+distortion.y))+(1.0-sx)*distortion.y;}if(uv.x<distortion.y+columns&&uv.x>distortion.y-columns*random){float sy=clamp(ceil(seeds.y),0.0,1.0);uv.x=sy*distortion.x+(1.0-sy)*(1.0-(uv.x+distortion.x));}vec2 normal=texture2D(perturbationMap,uv*random*random).rg;uv+=normal*seeds*(random*0.2);}}";

// src/effects/GlitchEffect.js
var textureTag = "Glitch.Generated";
function randomFloat(low, high) {
  return low + Math.random() * (high - low);
}
var GlitchEffect = class extends Effect {
  /**
   * Constructs a new glitch effect.
   *
   * TODO Change ratio to 0.15.
   * @param {Object} [options] - The options.
   * @param {Vector2} [options.chromaticAberrationOffset] - A chromatic aberration offset. If provided, the glitch effect will influence this offset.
   * @param {Vector2} [options.delay] - The minimum and maximum delay between glitch activations in seconds.
   * @param {Vector2} [options.duration] - The minimum and maximum duration of a glitch in seconds.
   * @param {Vector2} [options.strength] - The strength of weak and strong glitches.
   * @param {Texture} [options.perturbationMap] - A perturbation map. If none is provided, a noise texture will be created.
   * @param {Number} [options.dtSize=64] - The size of the generated noise map. Will be ignored if a perturbation map is provided.
   * @param {Number} [options.columns=0.05] - The scale of the blocky glitch columns.
   * @param {Number} [options.ratio=0.85] - The threshold for strong glitches.
   */
  constructor({
    chromaticAberrationOffset = null,
    delay = new Vector220(1.5, 3.5),
    duration = new Vector220(0.6, 1),
    strength = new Vector220(0.3, 1),
    columns = 0.05,
    ratio = 0.85,
    perturbationMap = null,
    dtSize = 64
  } = {}) {
    super("GlitchEffect", glitch_default, {
      uniforms: /* @__PURE__ */ new Map([
        ["perturbationMap", new Uniform32(null)],
        ["columns", new Uniform32(columns)],
        ["active", new Uniform32(false)],
        ["random", new Uniform32(1)],
        ["seeds", new Uniform32(new Vector220())],
        ["distortion", new Uniform32(new Vector220())]
      ])
    });
    if (perturbationMap === null) {
      const map = new NoiseTexture(dtSize, dtSize, RGBAFormat3);
      map.name = textureTag;
      this.perturbationMap = map;
    } else {
      this.perturbationMap = perturbationMap;
    }
    this.time = 0;
    this.distortion = this.uniforms.get("distortion").value;
    this.delay = delay;
    this.duration = duration;
    this.breakPoint = new Vector220(
      randomFloat(this.delay.x, this.delay.y),
      randomFloat(this.duration.x, this.duration.y)
    );
    this.strength = strength;
    this.mode = GlitchMode.SPORADIC;
    this.ratio = ratio;
    this.chromaticAberrationOffset = chromaticAberrationOffset;
  }
  /**
   * Random number seeds.
   *
   * @type {Vector2}
   * @private
   */
  get seeds() {
    return this.uniforms.get("seeds").value;
  }
  /**
   * Indicates whether the glitch effect is currently active.
   *
   * @type {Boolean}
   */
  get active() {
    return this.uniforms.get("active").value;
  }
  /**
   * Indicates whether the glitch effect is currently active.
   *
   * @deprecated Use active instead.
   * @return {Boolean} Whether the glitch effect is active.
   */
  isActive() {
    return this.active;
  }
  /**
   * The minimum delay between glitch activations.
   *
   * @type {Number}
   */
  get minDelay() {
    return this.delay.x;
  }
  set minDelay(value) {
    this.delay.x = value;
  }
  /**
   * Returns the minimum delay between glitch activations.
   *
   * @deprecated Use minDelay instead.
   * @return {Number} The minimum delay in seconds.
   */
  getMinDelay() {
    return this.delay.x;
  }
  /**
   * Sets the minimum delay between glitch activations.
   *
   * @deprecated Use minDelay instead.
   * @param {Number} value - The minimum delay in seconds.
   */
  setMinDelay(value) {
    this.delay.x = value;
  }
  /**
   * The maximum delay between glitch activations.
   *
   * @type {Number}
   */
  get maxDelay() {
    return this.delay.y;
  }
  set maxDelay(value) {
    this.delay.y = value;
  }
  /**
   * Returns the maximum delay between glitch activations.
   *
   * @deprecated Use maxDelay instead.
   * @return {Number} The maximum delay in seconds.
   */
  getMaxDelay() {
    return this.delay.y;
  }
  /**
   * Sets the maximum delay between glitch activations.
   *
   * @deprecated Use maxDelay instead.
   * @param {Number} value - The maximum delay in seconds.
   */
  setMaxDelay(value) {
    this.delay.y = value;
  }
  /**
   * The minimum duration of sporadic glitches.
   *
   * @type {Number}
   */
  get minDuration() {
    return this.duration.x;
  }
  set minDuration(value) {
    this.duration.x = value;
  }
  /**
   * Returns the minimum duration of sporadic glitches.
   *
   * @deprecated Use minDuration instead.
   * @return {Number} The minimum duration in seconds.
   */
  getMinDuration() {
    return this.duration.x;
  }
  /**
   * Sets the minimum duration of sporadic glitches.
   *
   * @deprecated Use minDuration instead.
   * @param {Number} value - The minimum duration in seconds.
   */
  setMinDuration(value) {
    this.duration.x = value;
  }
  /**
   * The maximum duration of sporadic glitches.
   *
   * @type {Number}
   */
  get maxDuration() {
    return this.duration.y;
  }
  set maxDuration(value) {
    this.duration.y = value;
  }
  /**
   * Returns the maximum duration of sporadic glitches.
   *
   * @deprecated Use maxDuration instead.
   * @return {Number} The maximum duration in seconds.
   */
  getMaxDuration() {
    return this.duration.y;
  }
  /**
   * Sets the maximum duration of sporadic glitches.
   *
   * @deprecated Use maxDuration instead.
   * @param {Number} value - The maximum duration in seconds.
   */
  setMaxDuration(value) {
    this.duration.y = value;
  }
  /**
   * The strength of weak glitches.
   *
   * @type {Number}
   */
  get minStrength() {
    return this.strength.x;
  }
  set minStrength(value) {
    this.strength.x = value;
  }
  /**
   * Returns the strength of weak glitches.
   *
   * @deprecated Use minStrength instead.
   * @return {Number} The strength.
   */
  getMinStrength() {
    return this.strength.x;
  }
  /**
   * Sets the strength of weak glitches.
   *
   * @deprecated Use minStrength instead.
   * @param {Number} value - The strength.
   */
  setMinStrength(value) {
    this.strength.x = value;
  }
  /**
   * The strength of strong glitches.
   *
   * @type {Number}
   */
  get maxStrength() {
    return this.strength.y;
  }
  set maxStrength(value) {
    this.strength.y = value;
  }
  /**
   * Returns the strength of strong glitches.
   *
   * @deprecated Use maxStrength instead.
   * @return {Number} The strength.
   */
  getMaxStrength() {
    return this.strength.y;
  }
  /**
   * Sets the strength of strong glitches.
   *
   * @deprecated Use maxStrength instead.
   * @param {Number} value - The strength.
   */
  setMaxStrength(value) {
    this.strength.y = value;
  }
  /**
   * Returns the current glitch mode.
   *
   * @deprecated Use mode instead.
   * @return {GlitchMode} The mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the current glitch mode.
   *
   * @deprecated Use mode instead.
   * @param {GlitchMode} value - The mode.
   */
  setMode(value) {
    this.mode = value;
  }
  /**
   * Returns the glitch ratio.
   *
   * @deprecated Use ratio instead.
   * @return {Number} The ratio.
   */
  getGlitchRatio() {
    return 1 - this.ratio;
  }
  /**
   * Sets the ratio of weak (0.0) and strong (1.0) glitches.
   *
   * @deprecated Use ratio instead.
   * @param {Number} value - The ratio. Range is [0.0, 1.0].
   */
  setGlitchRatio(value) {
    this.ratio = Math.min(Math.max(1 - value, 0), 1);
  }
  /**
   * The glitch column size.
   *
   * @type {Number}
   */
  get columns() {
    return this.uniforms.get("columns").value;
  }
  set columns(value) {
    this.uniforms.get("columns").value = value;
  }
  /**
   * Returns the glitch column size.
   *
   * @deprecated Use columns instead.
   * @return {Number} The glitch column size.
   */
  getGlitchColumns() {
    return this.columns;
  }
  /**
   * Sets the glitch column size.
   *
   * @deprecated Use columns instead.
   * @param {Number} value - The glitch column size.
   */
  setGlitchColumns(value) {
    this.columns = value;
  }
  /**
   * Returns the chromatic aberration offset.
   *
   * @deprecated Use chromaticAberrationOffset instead.
   * @return {Vector2} The offset.
   */
  getChromaticAberrationOffset() {
    return this.chromaticAberrationOffset;
  }
  /**
   * Sets the chromatic aberration offset.
   *
   * @deprecated Use chromaticAberrationOffset instead.
   * @param {Vector2} value - The offset.
   */
  setChromaticAberrationOffset(value) {
    this.chromaticAberrationOffset = value;
  }
  /**
   * The perturbation map.
   *
   * @type {Texture}
   */
  get perturbationMap() {
    return this.uniforms.get("perturbationMap").value;
  }
  set perturbationMap(value) {
    const currentMap = this.perturbationMap;
    if (currentMap !== null && currentMap.name === textureTag) {
      currentMap.dispose();
    }
    value.minFilter = value.magFilter = NearestFilter6;
    value.wrapS = value.wrapT = RepeatWrapping;
    value.generateMipmaps = false;
    this.uniforms.get("perturbationMap").value = value;
  }
  /**
   * Returns the current perturbation map.
   *
   * @deprecated Use perturbationMap instead.
   * @return {Texture} The current perturbation map.
   */
  getPerturbationMap() {
    return this.perturbationMap;
  }
  /**
   * Replaces the current perturbation map with the given one.
   *
   * The current map will be disposed if it was generated by this effect.
   *
   * @deprecated Use perturbationMap instead.
   * @param {Texture} value - The new perturbation map.
   */
  setPerturbationMap(value) {
    this.perturbationMap = value;
  }
  /**
   * Generates a perturbation map.
   *
   * @deprecated Use NoiseTexture instead.
   * @param {Number} [value=64] - The texture size.
   * @return {DataTexture} The perturbation map.
   */
  generatePerturbationMap(value = 64) {
    const map = new NoiseTexture(value, value, RGBAFormat3);
    map.name = textureTag;
    return map;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const mode = this.mode;
    const breakPoint = this.breakPoint;
    const offset = this.chromaticAberrationOffset;
    const s = this.strength;
    let time = this.time;
    let active = false;
    let r = 0, a = 0;
    let trigger;
    if (mode !== GlitchMode.DISABLED) {
      if (mode === GlitchMode.SPORADIC) {
        time += deltaTime;
        trigger = time > breakPoint.x;
        if (time >= breakPoint.x + breakPoint.y) {
          breakPoint.set(
            randomFloat(this.delay.x, this.delay.y),
            randomFloat(this.duration.x, this.duration.y)
          );
          time = 0;
        }
      }
      r = Math.random();
      this.uniforms.get("random").value = r;
      if (trigger && r > this.ratio || mode === GlitchMode.CONSTANT_WILD) {
        active = true;
        r *= s.y * 0.03;
        a = randomFloat(-Math.PI, Math.PI);
        this.seeds.set(randomFloat(-s.y, s.y), randomFloat(-s.y, s.y));
        this.distortion.set(randomFloat(0, 1), randomFloat(0, 1));
      } else if (trigger || mode === GlitchMode.CONSTANT_MILD) {
        active = true;
        r *= s.x * 0.03;
        a = randomFloat(-Math.PI, Math.PI);
        this.seeds.set(randomFloat(-s.x, s.x), randomFloat(-s.x, s.x));
        this.distortion.set(randomFloat(0, 1), randomFloat(0, 1));
      }
      this.time = time;
    }
    if (offset !== null) {
      if (active) {
        offset.set(Math.cos(a), Math.sin(a)).multiplyScalar(r);
      } else {
        offset.set(0, 0);
      }
    }
    this.uniforms.get("active").value = active;
  }
  /**
   * Deletes generated resources.
   */
  dispose() {
    const map = this.perturbationMap;
    if (map !== null && map.name === textureTag) {
      map.dispose();
    }
  }
};

// src/effects/GodRaysEffect.js
import {
  BasicDepthPacking as BasicDepthPacking15,
  Color as Color5,
  DepthTexture as DepthTexture2,
  Matrix4 as Matrix42,
  Scene as Scene2,
  Uniform as Uniform33,
  Vector2 as Vector221,
  Vector3 as Vector32,
  WebGLRenderTarget as WebGLRenderTarget17
} from "three";

// src/effects/glsl/god-rays.frag
var god_rays_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D map;\n#else\nuniform lowp sampler2D map;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv);}";

// src/effects/GodRaysEffect.js
var v = /* @__PURE__ */ new Vector32();
var m = /* @__PURE__ */ new Matrix42();
var GodRaysEffect = class extends Effect {
  /**
   * Constructs a new god rays effect.
   *
   * @param {Camera} [camera] - The main camera.
   * @param {Mesh|Points} [lightSource] - The light source. Must not write depth and has to be flagged as transparent.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Number} [options.samples=60.0] - The number of samples per pixel.
   * @param {Number} [options.density=0.96] - The density of the light rays.
   * @param {Number} [options.decay=0.9] - An illumination decay factor.
   * @param {Number} [options.weight=0.4] - A light ray weight factor.
   * @param {Number} [options.exposure=0.6] - A constant attenuation coefficient.
   * @param {Number} [options.clampMax=1.0] - An upper bound for the saturation of the overall effect.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   * @param {KernelSize} [options.kernelSize=KernelSize.SMALL] - The blur kernel size. Has no effect if blur is disabled.
   * @param {Boolean} [options.blur=true] - Whether the god rays should be blurred to reduce artifacts.
   */
  constructor(camera, lightSource, {
    blendFunction = BlendFunction.SCREEN,
    samples = 60,
    density = 0.96,
    decay = 0.9,
    weight = 0.4,
    exposure = 0.6,
    clampMax = 1,
    blur = true,
    kernelSize = KernelSize.SMALL,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("GodRaysEffect", god_rays_default, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform33(null)]
      ])
    });
    this.camera = camera;
    this._lightSource = lightSource;
    this.lightSource = lightSource;
    this.lightScene = new Scene2();
    this.screenPosition = new Vector221();
    this.renderTargetA = new WebGLRenderTarget17(1, 1, { depthBuffer: false });
    this.renderTargetA.texture.name = "GodRays.Target.A";
    this.renderTargetB = this.renderTargetA.clone();
    this.renderTargetB.texture.name = "GodRays.Target.B";
    this.uniforms.get("map").value = this.renderTargetB.texture;
    this.renderTargetLight = new WebGLRenderTarget17(1, 1);
    this.renderTargetLight.texture.name = "GodRays.Light";
    this.renderTargetLight.depthTexture = new DepthTexture2();
    this.renderPassLight = new RenderPass(this.lightScene, camera);
    this.renderPassLight.clearPass.overrideClearColor = new Color5(0);
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color5(0);
    this.blurPass = new KawaseBlurPass({ kernelSize });
    this.blurPass.enabled = blur;
    this.depthMaskPass = new ShaderPass(new DepthMaskMaterial());
    const depthMaskMaterial = this.depthMaskMaterial;
    depthMaskMaterial.depthBuffer1 = this.renderTargetLight.depthTexture;
    depthMaskMaterial.copyCameraSettings(camera);
    this.godRaysPass = new ShaderPass(new GodRaysMaterial(this.screenPosition));
    const godRaysMaterial = this.godRaysMaterial;
    godRaysMaterial.density = density;
    godRaysMaterial.decay = decay;
    godRaysMaterial.weight = weight;
    godRaysMaterial.exposure = exposure;
    godRaysMaterial.maxIntensity = clampMax;
    godRaysMaterial.samples = samples;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
  }
  set mainCamera(value) {
    this.camera = value;
    this.renderPassLight.mainCamera = value;
    this.depthMaskMaterial.copyCameraSettings(value);
  }
  /**
   * Sets the light source.
   *
   * @type {Mesh|Points}
   */
  get lightSource() {
    return this._lightSource;
  }
  set lightSource(value) {
    this._lightSource = value;
    if (value !== null) {
      value.material.depthWrite = false;
      value.material.transparent = true;
    }
  }
  /**
   * Returns the blur pass that reduces aliasing artifacts and makes the light softer.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * A texture that contains the intermediate result of this effect.
   *
   * @type {Texture}
   */
  get texture() {
    return this.renderTargetB.texture;
  }
  /**
   * Returns the god rays texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * The depth mask material.
   *
   * @type {DepthMaskMaterial}
   * @private
   */
  get depthMaskMaterial() {
    return this.depthMaskPass.fullscreenMaterial;
  }
  /**
   * The internal god rays material.
   *
   * @type {GodRaysMaterial}
   */
  get godRaysMaterial() {
    return this.godRaysPass.fullscreenMaterial;
  }
  /**
   * Returns the god rays material.
   *
   * @deprecated Use godRaysMaterial instead.
   * @return {GodRaysMaterial} The material.
   */
  getGodRaysMaterial() {
    return this.godRaysMaterial;
  }
  /**
   * Returns the resolution of this effect.
   *
   * @deprecated Use resolution instead.
   * @return {GodRaysMaterial} The material.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get dithering() {
    return this.godRaysMaterial.dithering;
  }
  set dithering(value) {
    const material = this.godRaysMaterial;
    material.dithering = value;
    material.needsUpdate = true;
  }
  /**
   * Indicates whether the god rays should be blurred to reduce artifacts.
   *
   * @type {Boolean}
   * @deprecated Use blurPass.enabled instead.
   */
  get blur() {
    return this.blurPass.enabled;
  }
  set blur(value) {
    this.blurPass.enabled = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurPass.kernelSize instead.
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * The number of samples per pixel.
   *
   * @type {Number}
   * @deprecated Use godRaysMaterial.samples instead.
   */
  get samples() {
    return this.godRaysMaterial.samples;
  }
  /**
   * A higher sample count improves quality at the cost of performance.
   *
   * @type {Number}
   * @deprecated Use godRaysMaterial.samples instead.
   */
  set samples(value) {
    this.godRaysMaterial.samples = value;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {Number} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking15) {
    this.depthMaskPass.fullscreenMaterial.depthBuffer0 = depthTexture;
    this.depthMaskPass.fullscreenMaterial.depthPacking0 = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const lightSource = this.lightSource;
    const parent = lightSource.parent;
    const matrixAutoUpdate = lightSource.matrixAutoUpdate;
    const renderTargetA = this.renderTargetA;
    const renderTargetLight = this.renderTargetLight;
    lightSource.material.depthWrite = true;
    lightSource.matrixAutoUpdate = false;
    lightSource.updateWorldMatrix(true, false);
    if (parent !== null) {
      if (!matrixAutoUpdate) {
        m.copy(lightSource.matrix);
      }
      lightSource.matrix.copy(lightSource.matrixWorld);
    }
    this.lightScene.add(lightSource);
    this.renderPassLight.render(renderer, renderTargetLight);
    this.clearPass.render(renderer, renderTargetA);
    this.depthMaskPass.render(renderer, renderTargetLight, renderTargetA);
    lightSource.material.depthWrite = false;
    lightSource.matrixAutoUpdate = matrixAutoUpdate;
    if (parent !== null) {
      if (!matrixAutoUpdate) {
        lightSource.matrix.copy(m);
      }
      parent.add(lightSource);
    }
    v.setFromMatrixPosition(lightSource.matrixWorld).project(this.camera);
    this.screenPosition.set(
      Math.min(Math.max((v.x + 1) * 0.5, -1), 2),
      Math.min(Math.max((v.y + 1) * 0.5, -1), 2)
    );
    if (this.blurPass.enabled) {
      this.blurPass.render(renderer, renderTargetA, renderTargetA);
    }
    this.godRaysPass.render(renderer, renderTargetA, this.renderTargetB);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.renderTargetA.setSize(w, h);
    this.renderTargetB.setSize(w, h);
    this.renderTargetLight.setSize(w, h);
    this.blurPass.resolution.copy(resolution);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    this.renderPassLight.initialize(renderer, alpha, frameBufferType);
    this.depthMaskPass.initialize(renderer, alpha, frameBufferType);
    this.godRaysPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTargetA.texture.type = frameBufferType;
      this.renderTargetB.texture.type = frameBufferType;
      this.renderTargetLight.texture.type = frameBufferType;
      if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTargetA.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetB.texture, SRGBColorSpace);
        setTextureColorSpace(this.renderTargetLight.texture, SRGBColorSpace);
      }
    }
  }
};

// src/effects/GridEffect.js
import { Uniform as Uniform34, Vector2 as Vector222 } from "three";

// src/effects/glsl/grid.frag
var grid_default = "uniform vec2 scale;uniform float lineWidth;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float grid=0.5-max(abs(mod(uv.x*scale.x,1.0)-0.5),abs(mod(uv.y*scale.y,1.0)-0.5));outputColor=vec4(vec3(smoothstep(0.0,lineWidth,grid)),inputColor.a);}";

// src/effects/GridEffect.js
var GridEffect = class extends Effect {
  /**
   * Constructs a new grid effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
   * @param {Number} [options.scale=1.0] - The scale of the grid pattern.
   * @param {Number} [options.lineWidth=0.0] - The line width of the grid pattern.
   */
  constructor({ blendFunction = BlendFunction.OVERLAY, scale = 1, lineWidth = 0 } = {}) {
    super("GridEffect", grid_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["scale", new Uniform34(new Vector222())],
        ["lineWidth", new Uniform34(lineWidth)]
      ])
    });
    this.resolution = new Vector222();
    this.s = 0;
    this.scale = scale;
    this.l = 0;
    this.lineWidth = lineWidth;
  }
  /**
   * The scale.
   *
   * @type {Number}
   */
  get scale() {
    return this.s;
  }
  set scale(value) {
    this.s = Math.max(value, 1e-6);
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current grid scale.
   *
   * @deprecated Use scale instead.
   * @return {Number} The grid scale.
   */
  getScale() {
    return this.scale;
  }
  /**
   * Sets the grid scale.
   *
   * @deprecated Use scale instead.
   * @param {Number} value - The new grid scale.
   */
  setScale(value) {
    this.scale = value;
  }
  /**
   * The line width.
   *
   * @type {Number}
   */
  get lineWidth() {
    return this.l;
  }
  set lineWidth(value) {
    this.l = value;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current grid line width.
   *
   * @deprecated Use lineWidth instead.
   * @return {Number} The grid line width.
   */
  getLineWidth() {
    return this.lineWidth;
  }
  /**
   * Sets the grid line width.
   *
   * @deprecated Use lineWidth instead.
   * @param {Number} value - The new grid line width.
   */
  setLineWidth(value) {
    this.lineWidth = value;
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.resolution.set(width, height);
    const aspect = width / height;
    const scale = this.scale * (height * 0.125);
    this.uniforms.get("scale").value.set(aspect * scale, scale);
    this.uniforms.get("lineWidth").value = scale / height + this.lineWidth;
  }
};

// src/effects/HueSaturationEffect.js
import { Uniform as Uniform35, Vector3 as Vector33 } from "three";

// src/effects/glsl/hue-saturation.frag
var hue_saturation_default = "uniform vec3 hue;uniform float saturation;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(dot(inputColor.rgb,hue.xyz),dot(inputColor.rgb,hue.zxy),dot(inputColor.rgb,hue.yzx));float average=(color.r+color.g+color.b)/3.0;vec3 diff=average-color;if(saturation>0.0){color+=diff*(1.0-1.0/(1.001-saturation));}else{color+=diff*-saturation;}outputColor=vec4(min(color,1.0),inputColor.a);}";

// src/effects/HueSaturationEffect.js
var HueSaturationEffect = class extends Effect {
  /**
   * Constructs a new hue/saturation effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Number} [options.hue=0.0] - The hue in radians.
   * @param {Number} [options.saturation=0.0] - The saturation factor, ranging from -1 to 1, where 0 means no change.
   */
  constructor({ blendFunction = BlendFunction.SRC, hue = 0, saturation = 0 } = {}) {
    super("HueSaturationEffect", hue_saturation_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["hue", new Uniform35(new Vector33())],
        ["saturation", new Uniform35(saturation)]
      ])
    });
    this.hue = hue;
  }
  /**
   * The saturation.
   *
   * @type {Number}
   */
  get saturation() {
    return this.uniforms.get("saturation").value;
  }
  set saturation(value) {
    this.uniforms.get("saturation").value = value;
  }
  /**
   * Returns the saturation.
   *
   * @deprecated Use saturation instead.
   * @return {Number} The saturation.
   */
  getSaturation() {
    return this.saturation;
  }
  /**
   * Sets the saturation.
   *
   * @deprecated Use saturation instead.
   * @param {Number} value - The saturation.
   */
  setSaturation(value) {
    this.saturation = value;
  }
  /**
   * The hue.
   *
   * @type {Number}
   */
  get hue() {
    const hue = this.uniforms.get("hue").value;
    return Math.acos((hue.x * 3 - 1) / 2);
  }
  set hue(value) {
    const s = Math.sin(value), c2 = Math.cos(value);
    this.uniforms.get("hue").value.set(
      (2 * c2 + 1) / 3,
      (-Math.sqrt(3) * s - c2 + 1) / 3,
      (Math.sqrt(3) * s - c2 + 1) / 3
    );
  }
  /**
   * Returns the hue.
   *
   * @deprecated Use hue instead.
   * @return {Number} The hue in radians.
   */
  getHue() {
    return this.hue;
  }
  /**
   * Sets the hue.
   *
   * @deprecated Use hue instead.
   * @param {Number} value - The hue in radians.
   */
  setHue(value) {
    this.hue = value;
  }
};

// src/effects/LensDistortionEffect.js
import { Uniform as Uniform36, Vector2 as Vector223 } from "three";

// src/effects/glsl/lens-distortion.frag
var lens_distortion_default = "uniform vec2 distortion;uniform vec2 principalPoint;uniform vec2 focalLength;uniform float skew;float mask(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void mainUv(inout vec2 uv){vec2 xn=2.0*(uv.st-0.5);vec3 xDistorted=vec3((1.0+distortion*dot(xn,xn))*xn,1.0);mat3 kk=mat3(vec3(focalLength.x,0.0,0.0),vec3(skew*focalLength.x,focalLength.y,0.0),vec3(principalPoint.x,principalPoint.y,1.0));uv=(kk*xDistorted).xy*0.5+0.5;}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=mask(uv)*inputColor;}";

// src/effects/LensDistortionEffect.js
var LensDistortionEffect = class extends Effect {
  /**
   * Constructs a new lens distortion effect.
   *
   * @param {Object} [options] - The options.
   * @param {Vector2} [options.distortion] - The distortion value.
   * @param {Vector2} [options.principalPoint] - The center point.
   * @param {Vector2} [options.focalLength] - The focal length.
   * @param {Number} [options.skew=0] - The skew value.
   */
  constructor({
    distortion = new Vector223(0, 0),
    principalPoint = new Vector223(0, 0),
    focalLength = new Vector223(1, 1),
    skew = 0
  } = {}) {
    super("LensDistortionEffect", lens_distortion_default, {
      uniforms: /* @__PURE__ */ new Map([
        ["distortion", new Uniform36(distortion)],
        ["principalPoint", new Uniform36(principalPoint)],
        ["focalLength", new Uniform36(focalLength)],
        ["skew", new Uniform36(skew)]
      ])
    });
  }
  /**
   * The radial distortion coefficients. Default is (0, 0).
   *
   * @type {Vector2}
   */
  get distortion() {
    return this.uniforms.get("distortion").value;
  }
  set distortion(value) {
    this.uniforms.get("distortion").value = value;
  }
  /**
   * The principal point. Default is (0, 0).
   *
   * @type {Vector2}
   */
  get principalPoint() {
    return this.uniforms.get("principalPoint").value;
  }
  set principalPoint(value) {
    this.uniforms.get("principalPoint").value = value;
  }
  /**
   * The focal length. Default is (1, 1).
   *
   * @type {Vector2}
   */
  get focalLength() {
    return this.uniforms.get("focalLength").value;
  }
  set focalLength(value) {
    this.uniforms.get("focalLength").value = value;
  }
  /**
   * The skew factor in radians.
   *
   * @type {Number}
   */
  get skew() {
    return this.uniforms.get("skew").value;
  }
  set skew(value) {
    this.uniforms.get("skew").value = value;
  }
};

// src/effects/LUT1DEffect.js
import { FloatType as FloatType5, HalfFloatType, Uniform as Uniform37 } from "three";

// src/effects/glsl/lut-1d.frag
var lut_1d_default = "#ifdef LUT_PRECISION_HIGH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D lut;\n#else\nuniform mediump sampler2D lut;\n#endif\n#else\nuniform lowp sampler2D lut;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=vec4(texture2D(lut,vec2(inputColor.r,0.5)).r,texture2D(lut,vec2(inputColor.g,0.5)).r,texture2D(lut,vec2(inputColor.b,0.5)).r,inputColor.a);}";

// src/effects/LUT1DEffect.js
var LUT1DEffect = class extends Effect {
  /**
   * Constructs a new color grading effect.
   *
   * @param {Texture} lut - The lookup texture.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   */
  constructor(lut, { blendFunction = BlendFunction.SRC } = {}) {
    super("LUT1DEffect", lut_1d_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([["lut", new Uniform37(null)]])
    });
    this.lut = lut;
  }
  /**
   * The LUT.
   *
   * @type {Texture}
   */
  get lut() {
    return this.uniforms.get("lut").value;
  }
  set lut(value) {
    this.uniforms.get("lut").value = value;
    if (value !== null && (value.type === FloatType5 || value.type === HalfFloatType)) {
      this.defines.set("LUT_PRECISION_HIGH", "1");
    }
  }
};

// src/effects/LUT3DEffect.js
import {
  Data3DTexture as Data3DTexture2,
  FloatType as FloatType6,
  HalfFloatType as HalfFloatType2,
  LinearFilter as LinearFilter4,
  NearestFilter as NearestFilter7,
  sRGBEncoding as sRGBEncoding2,
  Uniform as Uniform38,
  Vector3 as Vector34
} from "three";

// src/effects/glsl/lut-3d.frag
var lut_3d_default = "uniform vec3 scale;uniform vec3 offset;\n#ifdef CUSTOM_INPUT_DOMAIN\nuniform vec3 domainMin;uniform vec3 domainMax;\n#endif\n#ifdef LUT_3D\n#ifdef LUT_PRECISION_HIGH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler3D lut;\n#else\nuniform mediump sampler3D lut;\n#endif\n#else\nuniform lowp sampler3D lut;\n#endif\nvec4 applyLUT(const in vec3 rgb){\n#ifdef TETRAHEDRAL_INTERPOLATION\nvec3 p=floor(rgb);vec3 f=rgb-p;vec3 v1=(p+0.5)*LUT_TEXEL_WIDTH;vec3 v4=(p+1.5)*LUT_TEXEL_WIDTH;vec3 v2,v3;vec3 frac;if(f.r>=f.g){if(f.g>f.b){frac=f.rgb;v2=vec3(v4.x,v1.y,v1.z);v3=vec3(v4.x,v4.y,v1.z);}else if(f.r>=f.b){frac=f.rbg;v2=vec3(v4.x,v1.y,v1.z);v3=vec3(v4.x,v1.y,v4.z);}else{frac=f.brg;v2=vec3(v1.x,v1.y,v4.z);v3=vec3(v4.x,v1.y,v4.z);}}else{if(f.b>f.g){frac=f.bgr;v2=vec3(v1.x,v1.y,v4.z);v3=vec3(v1.x,v4.y,v4.z);}else if(f.r>=f.b){frac=f.grb;v2=vec3(v1.x,v4.y,v1.z);v3=vec3(v4.x,v4.y,v1.z);}else{frac=f.gbr;v2=vec3(v1.x,v4.y,v1.z);v3=vec3(v1.x,v4.y,v4.z);}}vec4 n1=texture(lut,v1);vec4 n2=texture(lut,v2);vec4 n3=texture(lut,v3);vec4 n4=texture(lut,v4);vec4 weights=vec4(1.0-frac.x,frac.x-frac.y,frac.y-frac.z,frac.z);vec4 result=weights*mat4(vec4(n1.r,n2.r,n3.r,n4.r),vec4(n1.g,n2.g,n3.g,n4.g),vec4(n1.b,n2.b,n3.b,n4.b),vec4(1.0));return vec4(result.rgb,1.0);\n#else\nreturn texture(lut,rgb);\n#endif\n}\n#else\n#ifdef LUT_PRECISION_HIGH\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D lut;\n#else\nuniform mediump sampler2D lut;\n#endif\n#else\nuniform lowp sampler2D lut;\n#endif\nvec4 applyLUT(const in vec3 rgb){float slice=rgb.b*LUT_SIZE;float slice0=floor(slice);float interp=slice-slice0;float centeredInterp=interp-0.5;float slice1=slice0+sign(centeredInterp);\n#ifdef LUT_STRIP_HORIZONTAL\nfloat xOffset=clamp(rgb.r*LUT_TEXEL_HEIGHT,LUT_TEXEL_WIDTH*0.5,LUT_TEXEL_HEIGHT-LUT_TEXEL_WIDTH*0.5);vec2 uv0=vec2(slice0*LUT_TEXEL_HEIGHT+xOffset,rgb.g);vec2 uv1=vec2(slice1*LUT_TEXEL_HEIGHT+xOffset,rgb.g);\n#else\nfloat yOffset=clamp(rgb.g*LUT_TEXEL_WIDTH,LUT_TEXEL_HEIGHT*0.5,LUT_TEXEL_WIDTH-LUT_TEXEL_HEIGHT*0.5);vec2 uv0=vec2(rgb.r,slice0*LUT_TEXEL_WIDTH+yOffset);vec2 uv1=vec2(rgb.r,slice1*LUT_TEXEL_WIDTH+yOffset);\n#endif\nvec4 sample0=texture2D(lut,uv0);vec4 sample1=texture2D(lut,uv1);return mix(sample0,sample1,abs(centeredInterp));}\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 c=inputColor.rgb;\n#ifdef CUSTOM_INPUT_DOMAIN\nif(c.r>=domainMin.r&&c.g>=domainMin.g&&c.b>=domainMin.b&&c.r<=domainMax.r&&c.g<=domainMax.g&&c.b<=domainMax.b){c=applyLUT(scale*c+offset).rgb;}else{c=inputColor.rgb;}\n#else\n#if !defined(LUT_3D) || defined(TETRAHEDRAL_INTERPOLATION)\nc=clamp(c,0.0,1.0);\n#endif\nc=applyLUT(scale*c+offset).rgb;\n#endif\noutputColor=vec4(c,inputColor.a);}";

// src/effects/LUT3DEffect.js
var LUT3DEffect = class extends Effect {
  /**
   * Constructs a new color grading effect.
   *
   * @param {Texture} lut - The lookup texture.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.tetrahedralInterpolation=false] - Enables or disables tetrahedral interpolation.
   * @param {TextureEncoding} [options.inputEncoding=sRGBEncoding] - Deprecated.
   * @param {ColorSpace} [options.inputColorSpace=SRGBColorSpace] - The input color space.
   */
  constructor(lut, {
    blendFunction = BlendFunction.SRC,
    tetrahedralInterpolation = false,
    inputEncoding = sRGBEncoding2,
    inputColorSpace
  } = {}) {
    super("LUT3DEffect", lut_3d_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["lut", new Uniform38(null)],
        ["scale", new Uniform38(new Vector34())],
        ["offset", new Uniform38(new Vector34())],
        ["domainMin", new Uniform38(null)],
        ["domainMax", new Uniform38(null)]
      ])
    });
    this.tetrahedralInterpolation = tetrahedralInterpolation;
    this.inputColorSpace = inputColorSpace || encodingToColorSpace.get(inputEncoding);
    this.lut = lut;
  }
  /**
   * The input encoding. Default is `sRGBEncoding`.
   *
   * Set this to `LinearEncoding` if your LUT expects linear color input.
   *
   * @deprecated Use inputColorSpace instead.
   * @type {TextureEncoding}
   */
  get inputEncoding() {
    return this.inputColorSpace;
  }
  set inputEncoding(value) {
    this.inputColorSpace = value;
  }
  /**
   * Returns the input encoding.
   *
   * @deprecated Use inputColorSpace instead.
   * @return {TextureEncoding} The encoding.
   */
  getInputEncoding() {
    return this.inputColorSpace;
  }
  /**
   * Sets the input encoding.
   *
   * @deprecated Use inputColorSpace instead.
   * @param {TextureEncoding} value - The encoding.
   */
  setInputEncoding(value) {
    this.inputColorSpace = value;
  }
  /**
   * Returns the output encoding.
   *
   * @deprecated Use outputColorSpace instead.
   * @return {TextureEncoding} The encoding.
   */
  getOutputEncoding() {
    return this.outputColorSpace;
  }
  /**
   * The LUT.
   *
   * @type {Texture}
   */
  get lut() {
    return this.uniforms.get("lut").value;
  }
  set lut(value) {
    const defines = this.defines;
    const uniforms = this.uniforms;
    if (this.lut !== value) {
      uniforms.get("lut").value = value;
      if (value !== null) {
        const image = value.image;
        const tetrahedralInterpolation = this.tetrahedralInterpolation;
        defines.clear();
        defines.set("LUT_SIZE", Math.min(image.width, image.height).toFixed(16));
        defines.set("LUT_TEXEL_WIDTH", (1 / image.width).toFixed(16));
        defines.set("LUT_TEXEL_HEIGHT", (1 / image.height).toFixed(16));
        uniforms.get("domainMin").value = null;
        uniforms.get("domainMax").value = null;
        if (value.type === FloatType6 || value.type === HalfFloatType2) {
          defines.set("LUT_PRECISION_HIGH", "1");
        }
        if (image.width > image.height) {
          defines.set("LUT_STRIP_HORIZONTAL", "1");
        } else if (value instanceof Data3DTexture2) {
          defines.set("LUT_3D", "1");
        }
        if (value instanceof LookupTexture) {
          const min = value.domainMin;
          const max = value.domainMax;
          if (min.x !== 0 || min.y !== 0 || min.z !== 0 || max.x !== 1 || max.y !== 1 || max.z !== 1) {
            defines.set("CUSTOM_INPUT_DOMAIN", "1");
            uniforms.get("domainMin").value = min.clone();
            uniforms.get("domainMax").value = max.clone();
          }
        }
        this.tetrahedralInterpolation = tetrahedralInterpolation;
      }
    }
  }
  /**
   * Returns the current LUT.
   *
   * @deprecated Use lut instead.
   * @return {Texture} The LUT.
   */
  getLUT() {
    return this.lut;
  }
  /**
   * Sets the LUT.
   *
   * @deprecated Use lut instead.
   * @param {Texture} value - The LUT.
   */
  setLUT(value) {
    this.lut = value;
  }
  /**
   * Updates the scale and offset for the LUT sampling coordinates.
   *
   * @private
   */
  updateScaleOffset() {
    const lut = this.lut;
    if (lut !== null) {
      const size = Math.min(lut.image.width, lut.image.height);
      const scale = this.uniforms.get("scale").value;
      const offset = this.uniforms.get("offset").value;
      if (this.tetrahedralInterpolation && lut instanceof Data3DTexture2) {
        if (this.defines.has("CUSTOM_INPUT_DOMAIN")) {
          const domainScale = lut.domainMax.clone().sub(lut.domainMin);
          scale.setScalar(size - 1).divide(domainScale);
          offset.copy(lut.domainMin).negate().multiply(scale);
        } else {
          scale.setScalar(size - 1);
          offset.setScalar(0);
        }
      } else {
        if (this.defines.has("CUSTOM_INPUT_DOMAIN")) {
          const domainScale = lut.domainMax.clone().sub(lut.domainMin).multiplyScalar(size);
          scale.setScalar(size - 1).divide(domainScale);
          offset.copy(lut.domainMin).negate().multiply(scale).addScalar(1 / (2 * size));
        } else {
          scale.setScalar((size - 1) / size);
          offset.setScalar(1 / (2 * size));
        }
      }
    }
  }
  /**
   * Configures parameters for tetrahedral interpolation.
   *
   * @private
   */
  configureTetrahedralInterpolation() {
    const lut = this.lut;
    if (lut !== null) {
      lut.minFilter = LinearFilter4;
      lut.magFilter = LinearFilter4;
      if (this.tetrahedralInterpolation) {
        if (lut instanceof Data3DTexture2) {
          lut.minFilter = NearestFilter7;
          lut.magFilter = NearestFilter7;
        } else {
          console.warn("Tetrahedral interpolation requires a 3D texture");
        }
      }
      if (lut.source === void 0) {
        lut.needsUpdate = true;
      }
    }
  }
  /**
   * Indicates whether tetrahedral interpolation is enabled. Requires a 3D LUT, disabled by default.
   *
   * Tetrahedral interpolation produces highly accurate results but is slower than hardware interpolation.
   *
   * @type {Boolean}
   */
  get tetrahedralInterpolation() {
    return this.defines.has("TETRAHEDRAL_INTERPOLATION");
  }
  set tetrahedralInterpolation(value) {
    if (value) {
      this.defines.set("TETRAHEDRAL_INTERPOLATION", "1");
    } else {
      this.defines.delete("TETRAHEDRAL_INTERPOLATION");
    }
    this.configureTetrahedralInterpolation();
    this.updateScaleOffset();
    this.setChanged();
  }
  /**
   * Enables or disables tetrahedral interpolation.
   *
   * @deprecated Use tetrahedralInterpolation instead.
   * @param {Boolean} value - Whether tetrahedral interpolation should be enabled.
   */
  setTetrahedralInterpolationEnabled(value) {
    this.tetrahedralInterpolation = value;
  }
};

// src/effects/glsl/noise.frag
var noise_default = "void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 noise=vec3(rand(uv*(1.0+time)));\n#ifdef PREMULTIPLY\noutputColor=vec4(min(inputColor.rgb*noise,vec3(1.0)),inputColor.a);\n#else\noutputColor=vec4(noise,inputColor.a);\n#endif\n}";

// src/effects/NoiseEffect.js
var NoiseEffect = class extends Effect {
  /**
   * Constructs a new noise effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
   * @param {Boolean} [options.premultiply=false] - Whether the noise should be multiplied with the input colors prior to blending.
   */
  constructor({ blendFunction = BlendFunction.SCREEN, premultiply = false } = {}) {
    super("NoiseEffect", noise_default, { blendFunction });
    this.premultiply = premultiply;
  }
  /**
   * Indicates whether noise will be multiplied with the input colors prior to blending.
   *
   * @type {Boolean}
   */
  get premultiply() {
    return this.defines.has("PREMULTIPLY");
  }
  set premultiply(value) {
    if (this.premultiply !== value) {
      if (value) {
        this.defines.set("PREMULTIPLY", "1");
      } else {
        this.defines.delete("PREMULTIPLY");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether noise will be multiplied with the input colors prior to blending.
   *
   * @deprecated Use premultiply instead.
   * @return {Boolean} Whether noise is premultiplied.
   */
  isPremultiplied() {
    return this.premultiply;
  }
  /**
   * Controls whether noise should be multiplied with the input colors prior to blending.
   *
   * @deprecated Use premultiply instead.
   * @param {Boolean} value - Whether noise should be premultiplied.
   */
  setPremultiplied(value) {
    this.premultiply = value;
  }
};

// src/effects/OutlineEffect.js
import { Color as Color6, RepeatWrapping as RepeatWrapping2, Uniform as Uniform39, UnsignedByteType as UnsignedByteType15, WebGLRenderTarget as WebGLRenderTarget18 } from "three";

// src/effects/glsl/outline.frag
var outline_default3 = "uniform lowp sampler2D edgeTexture;uniform lowp sampler2D maskTexture;uniform vec3 visibleEdgeColor;uniform vec3 hiddenEdgeColor;uniform float pulse;uniform float edgeStrength;\n#ifdef USE_PATTERN\nuniform lowp sampler2D patternTexture;varying vec2 vUvPattern;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 edge=texture2D(edgeTexture,uv).rg;vec2 mask=texture2D(maskTexture,uv).rg;\n#ifndef X_RAY\nedge.y=0.0;\n#endif\nedge*=(edgeStrength*mask.x*pulse);vec3 color=edge.x*visibleEdgeColor+edge.y*hiddenEdgeColor;float visibilityFactor=0.0;\n#ifdef USE_PATTERN\nvec4 patternColor=texture2D(patternTexture,vUvPattern);\n#ifdef X_RAY\nfloat hiddenFactor=0.5;\n#else\nfloat hiddenFactor=0.0;\n#endif\nvisibilityFactor=(1.0-mask.y>0.0)?1.0:hiddenFactor;visibilityFactor*=(1.0-mask.x)*patternColor.a;color+=visibilityFactor*patternColor.rgb;\n#endif\nfloat alpha=max(max(edge.x,edge.y),visibilityFactor);\n#ifdef ALPHA\noutputColor=vec4(color,alpha);\n#else\noutputColor=vec4(color,max(alpha,inputColor.a));\n#endif\n}";

// src/effects/glsl/outline.vert
var outline_default4 = "uniform float patternScale;varying vec2 vUvPattern;void mainSupport(const in vec2 uv){vUvPattern=uv*vec2(aspect,1.0)*patternScale;}";

// src/effects/OutlineEffect.js
var OutlineEffect = class extends Effect {
  /**
   * Constructs a new outline effect.
   *
   * @param {Scene} scene - The main scene.
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function. Use `BlendFunction.ALPHA` for dark outlines.
   * @param {Texture} [options.patternTexture=null] - A pattern texture.
   * @param {Number} [options.patternScale=1.0] - The pattern scale.
   * @param {Number} [options.edgeStrength=1.0] - The edge strength.
   * @param {Number} [options.pulseSpeed=0.0] - The pulse speed. A value of zero disables the pulse effect.
   * @param {Number} [options.visibleEdgeColor=0xffffff] - The color of visible edges.
   * @param {Number} [options.hiddenEdgeColor=0x22090a] - The color of hidden edges.
   * @param {KernelSize} [options.kernelSize=KernelSize.VERY_SMALL] - The blur kernel size.
   * @param {Boolean} [options.blur=false] - Whether the outline should be blurred.
   * @param {Boolean} [options.xRay=true] - Whether occluded parts of selected objects should be visible.
   * @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(scene, camera, {
    blendFunction = BlendFunction.SCREEN,
    patternTexture = null,
    patternScale = 1,
    edgeStrength = 1,
    pulseSpeed = 0,
    visibleEdgeColor = 16777215,
    hiddenEdgeColor = 2230538,
    kernelSize = KernelSize.VERY_SMALL,
    blur = false,
    xRay = true,
    multisampling = 0,
    resolutionScale = 0.5,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("OutlineEffect", outline_default3, {
      uniforms: /* @__PURE__ */ new Map([
        ["maskTexture", new Uniform39(null)],
        ["edgeTexture", new Uniform39(null)],
        ["edgeStrength", new Uniform39(edgeStrength)],
        ["visibleEdgeColor", new Uniform39(new Color6(visibleEdgeColor))],
        ["hiddenEdgeColor", new Uniform39(new Color6(hiddenEdgeColor))],
        ["pulse", new Uniform39(1)],
        ["patternScale", new Uniform39(patternScale)],
        ["patternTexture", new Uniform39(null)]
      ])
    });
    this.blendMode.addEventListener("change", (event) => {
      if (this.blendMode.blendFunction === BlendFunction.ALPHA) {
        this.defines.set("ALPHA", "1");
      } else {
        this.defines.delete("ALPHA");
      }
      this.setChanged();
    });
    this.blendMode.blendFunction = blendFunction;
    this.patternTexture = patternTexture;
    this.xRay = xRay;
    this.scene = scene;
    this.camera = camera;
    this.renderTargetMask = new WebGLRenderTarget18(1, 1);
    this.renderTargetMask.samples = multisampling;
    this.renderTargetMask.texture.name = "Outline.Mask";
    this.uniforms.get("maskTexture").value = this.renderTargetMask.texture;
    this.renderTargetOutline = new WebGLRenderTarget18(1, 1, { depthBuffer: false });
    this.renderTargetOutline.texture.name = "Outline.Edges";
    this.uniforms.get("edgeTexture").value = this.renderTargetOutline.texture;
    this.clearPass = new ClearPass();
    this.clearPass.overrideClearColor = new Color6(0);
    this.clearPass.overrideClearAlpha = 1;
    this.depthPass = new DepthPass(scene, camera);
    this.maskPass = new RenderPass(scene, camera, new DepthComparisonMaterial(this.depthPass.texture, camera));
    const clearPass = this.maskPass.clearPass;
    clearPass.overrideClearColor = new Color6(16777215);
    clearPass.overrideClearAlpha = 1;
    this.blurPass = new KawaseBlurPass({ resolutionScale, resolutionX, resolutionY, kernelSize });
    this.blurPass.enabled = blur;
    const resolution = this.blurPass.resolution;
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.outlinePass = new ShaderPass(new OutlineMaterial());
    const outlineMaterial = this.outlinePass.fullscreenMaterial;
    outlineMaterial.inputBuffer = this.renderTargetMask.texture;
    this.time = 0;
    this.forceUpdate = true;
    this.selection = new Selection();
    this.selection.layer = 10;
    this.pulseSpeed = pulseSpeed;
  }
  set mainScene(value) {
    this.scene = value;
    this.depthPass.mainScene = value;
    this.maskPass.mainScene = value;
  }
  set mainCamera(value) {
    this.camera = value;
    this.depthPass.mainCamera = value;
    this.maskPass.mainCamera = value;
    this.maskPass.overrideMaterial.copyCameraSettings(value);
  }
  /**
   * The resolution of this effect.
   *
   * @type {Resolution}
   */
  get resolution() {
    return this.blurPass.resolution;
  }
  /**
   * Returns the resolution.
   *
   * @return {Resizer} The resolution.
   */
  getResolution() {
    return this.blurPass.getResolution();
  }
  /**
   * The amount of MSAA samples.
   *
   * Requires WebGL 2. Set to zero to disable multisampling.
   *
   * @experimental Requires three >= r138.
   * @type {Number}
   */
  get multisampling() {
    return this.renderTargetMask.samples;
  }
  set multisampling(value) {
    this.renderTargetMask.samples = value;
    this.renderTargetMask.dispose();
  }
  /**
   * The pattern scale.
   *
   * @type {Number}
   */
  get patternScale() {
    return this.uniforms.get("patternScale").value;
  }
  set patternScale(value) {
    this.uniforms.get("patternScale").value = value;
  }
  /**
   * The edge strength.
   *
   * @type {Number}
   */
  get edgeStrength() {
    return this.uniforms.get("edgeStrength").value;
  }
  set edgeStrength(value) {
    this.uniforms.get("edgeStrength").value = value;
  }
  /**
   * The visible edge color.
   *
   * @type {Color}
   */
  get visibleEdgeColor() {
    return this.uniforms.get("visibleEdgeColor").value;
  }
  set visibleEdgeColor(value) {
    this.uniforms.get("visibleEdgeColor").value = value;
  }
  /**
   * The hidden edge color.
   *
   * @type {Color}
   */
  get hiddenEdgeColor() {
    return this.uniforms.get("hiddenEdgeColor").value;
  }
  set hiddenEdgeColor(value) {
    this.uniforms.get("hiddenEdgeColor").value = value;
  }
  /**
   * Returns the blur pass.
   *
   * @deprecated Use blurPass instead.
   * @return {KawaseBlurPass} The blur pass.
   */
  getBlurPass() {
    return this.blurPass;
  }
  /**
   * Returns the selection.
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * Returns the pulse speed.
   *
   * @deprecated Use pulseSpeed instead.
   * @return {Number} The speed.
   */
  getPulseSpeed() {
    return this.pulseSpeed;
  }
  /**
   * Sets the pulse speed. Set to zero to disable.
   *
   * @deprecated Use pulseSpeed instead.
   * @param {Number} value - The speed.
   */
  setPulseSpeed(value) {
    this.pulseSpeed = value;
  }
  /**
   * The current width of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.width instead.
   */
  get width() {
    return this.resolution.width;
  }
  set width(value) {
    this.resolution.preferredWidth = value;
  }
  /**
   * The current height of the internal render targets.
   *
   * @type {Number}
   * @deprecated Use resolution.height instead.
   */
  get height() {
    return this.resolution.height;
  }
  set height(value) {
    this.resolution.preferredHeight = value;
  }
  /**
   * The selection layer.
   *
   * @type {Number}
   * @deprecated Use selection.layer instead.
   */
  get selectionLayer() {
    return this.selection.layer;
  }
  set selectionLayer(value) {
    this.selection.layer = value;
  }
  /**
   * Indicates whether dithering is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get dithering() {
    return this.blurPass.dithering;
  }
  set dithering(value) {
    this.blurPass.dithering = value;
  }
  /**
   * The blur kernel size.
   *
   * @type {KernelSize}
   * @deprecated Use blurPass.kernelSize instead.
   */
  get kernelSize() {
    return this.blurPass.kernelSize;
  }
  set kernelSize(value) {
    this.blurPass.kernelSize = value;
  }
  /**
   * Indicates whether the outlines should be blurred.
   *
   * @type {Boolean}
   * @deprecated Use blurPass.enabled instead.
   */
  get blur() {
    return this.blurPass.enabled;
  }
  set blur(value) {
    this.blurPass.enabled = value;
  }
  /**
   * Indicates whether X-ray mode is enabled.
   *
   * @type {Boolean}
   */
  get xRay() {
    return this.defines.has("X_RAY");
  }
  set xRay(value) {
    if (this.xRay !== value) {
      if (value) {
        this.defines.set("X_RAY", "1");
      } else {
        this.defines.delete("X_RAY");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether X-ray mode is enabled.
   *
   * @deprecated Use xRay instead.
   * @return {Boolean} Whether X-ray mode is enabled.
   */
  isXRayEnabled() {
    return this.xRay;
  }
  /**
   * Enables or disables X-ray outlines.
   *
   * @deprecated Use xRay instead.
   * @param {Boolean} value - Whether X-ray should be enabled.
   */
  setXRayEnabled(value) {
    this.xRay = value;
  }
  /**
   * The pattern texture. Set to `null` to disable.
   *
   * @type {Texture}
   */
  get patternTexture() {
    return this.uniforms.get("patternTexture").value;
  }
  set patternTexture(value) {
    if (value !== null) {
      value.wrapS = value.wrapT = RepeatWrapping2;
      this.defines.set("USE_PATTERN", "1");
      this.setVertexShader(outline_default4);
    } else {
      this.defines.delete("USE_PATTERN");
      this.setVertexShader(null);
    }
    this.uniforms.get("patternTexture").value = value;
    this.setChanged();
  }
  /**
   * Sets the pattern texture.
   *
   * @deprecated Use patternTexture instead.
   * @param {Texture} value - The new texture.
   */
  setPatternTexture(value) {
    this.patternTexture = value;
  }
  /**
   * Returns the current resolution scale.
   *
   * @return {Number} The resolution scale.
   * @deprecated Use resolution instead.
   */
  getResolutionScale() {
    return this.resolution.scale;
  }
  /**
   * Sets the resolution scale.
   *
   * @param {Number} scale - The new resolution scale.
   * @deprecated Use resolution instead.
   */
  setResolutionScale(scale) {
    this.resolution.scale = scale;
  }
  /**
   * Clears the current selection and selects a list of objects.
   *
   * @param {Object3D[]} objects - The objects that should be outlined. This array will be copied.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.set() instead.
   */
  setSelection(objects) {
    this.selection.set(objects);
    return this;
  }
  /**
   * Clears the list of selected objects.
   *
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.clear() instead.
   */
  clearSelection() {
    this.selection.clear();
    return this;
  }
  /**
   * Selects an object.
   *
   * @param {Object3D} object - The object that should be outlined.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.add() instead.
   */
  selectObject(object) {
    this.selection.add(object);
    return this;
  }
  /**
   * Deselects an object.
   *
   * @param {Object3D} object - The object that should no longer be outlined.
   * @return {OutlinePass} This pass.
   * @deprecated Use selection.delete() instead.
   */
  deselectObject(object) {
    this.selection.delete(object);
    return this;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const scene = this.scene;
    const camera = this.camera;
    const selection = this.selection;
    const uniforms = this.uniforms;
    const pulse = uniforms.get("pulse");
    const background = scene.background;
    const mask = camera.layers.mask;
    if (this.forceUpdate || selection.size > 0) {
      scene.background = null;
      pulse.value = 1;
      if (this.pulseSpeed > 0) {
        pulse.value = Math.cos(this.time * this.pulseSpeed * 10) * 0.375 + 0.625;
      }
      this.time += deltaTime;
      selection.setVisible(false);
      this.depthPass.render(renderer);
      selection.setVisible(true);
      camera.layers.set(selection.layer);
      this.maskPass.render(renderer, this.renderTargetMask);
      camera.layers.mask = mask;
      scene.background = background;
      this.outlinePass.render(renderer, null, this.renderTargetOutline);
      if (this.blurPass.enabled) {
        this.blurPass.render(renderer, this.renderTargetOutline, this.renderTargetOutline);
      }
    }
    this.forceUpdate = selection.size > 0;
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.blurPass.setSize(width, height);
    this.renderTargetMask.setSize(width, height);
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.depthPass.setSize(w, h);
    this.renderTargetOutline.setSize(w, h);
    this.outlinePass.fullscreenMaterial.setSize(w, h);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, UnsignedByteType15);
    if (frameBufferType !== void 0) {
      this.depthPass.initialize(renderer, alpha, frameBufferType);
      this.maskPass.initialize(renderer, alpha, frameBufferType);
      this.outlinePass.initialize(renderer, alpha, frameBufferType);
    }
  }
};

// src/effects/PixelationEffect.js
import { Uniform as Uniform40, Vector2 as Vector224, Vector4 as Vector43 } from "three";

// src/effects/glsl/pixelation.frag
var pixelation_default = "uniform bool active;uniform vec4 d;void mainUv(inout vec2 uv){if(active){uv=d.xy*(floor(uv*d.zw)+0.5);}}";

// src/effects/PixelationEffect.js
var PixelationEffect = class extends Effect {
  /**
   * Constructs a new pixelation effect.
   *
   * @param {Object} [granularity=30.0] - The pixel granularity.
   */
  constructor(granularity = 30) {
    super("PixelationEffect", pixelation_default, {
      uniforms: /* @__PURE__ */ new Map([
        ["active", new Uniform40(false)],
        ["d", new Uniform40(new Vector43())]
      ])
    });
    this.resolution = new Vector224();
    this._granularity = 0;
    this.granularity = granularity;
  }
  /**
   * The pixel granularity.
   *
   * A higher value yields coarser visuals.
   *
   * @type {Number}
   */
  get granularity() {
    return this._granularity;
  }
  set granularity(value) {
    let d = Math.floor(value);
    if (d % 2 > 0) {
      d += 1;
    }
    this._granularity = d;
    this.uniforms.get("active").value = d > 0;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the pixel granularity.
   *
   * @deprecated Use granularity instead.
   * @return {Number} The granularity.
   */
  getGranularity() {
    return this.granularity;
  }
  /**
   * Sets the pixel granularity.
   *
   * @deprecated Use granularity instead.
   * @param {Number} value - The new granularity.
   */
  setGranularity(value) {
    this.granularity = value;
  }
  /**
   * Updates the granularity.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.set(width, height);
    const d = this.granularity;
    const x = d / resolution.x;
    const y = d / resolution.y;
    this.uniforms.get("d").value.set(x, y, 1 / x, 1 / y);
  }
};

// src/effects/RealisticBokehEffect.js
import { Uniform as Uniform41, Vector4 as Vector44 } from "three";

// src/effects/glsl/realistic-bokeh.frag
var realistic_bokeh_default = "uniform float focus;uniform float focalLength;uniform float fStop;uniform float maxBlur;uniform float luminanceThreshold;uniform float luminanceGain;uniform float bias;uniform float fringe;\n#ifdef MANUAL_DOF\nuniform vec4 dof;\n#endif\n#ifdef PENTAGON\nfloat pentagon(const in vec2 coords){const vec4 HS0=vec4(1.0,0.0,0.0,1.0);const vec4 HS1=vec4(0.309016994,0.951056516,0.0,1.0);const vec4 HS2=vec4(-0.809016994,0.587785252,0.0,1.0);const vec4 HS3=vec4(-0.809016994,-0.587785252,0.0,1.0);const vec4 HS4=vec4(0.309016994,-0.951056516,0.0,1.0);const vec4 HS5=vec4(0.0,0.0,1.0,1.0);const vec4 ONE=vec4(1.0);const float P_FEATHER=0.4;const float N_FEATHER=-P_FEATHER;float inOrOut=-4.0;vec4 P=vec4(coords,vec2(RINGS_FLOAT-1.3));vec4 dist=vec4(dot(P,HS0),dot(P,HS1),dot(P,HS2),dot(P,HS3));dist=smoothstep(N_FEATHER,P_FEATHER,dist);inOrOut+=dot(dist,ONE);dist.x=dot(P,HS4);dist.y=HS5.w-abs(P.z);dist=smoothstep(N_FEATHER,P_FEATHER,dist);inOrOut+=dist.x;return clamp(inOrOut,0.0,1.0);}\n#endif\nvec3 processTexel(const in vec2 coords,const in float blur){vec2 scale=texelSize*fringe*blur;vec3 c=vec3(texture2D(inputBuffer,coords+vec2(0.0,1.0)*scale).r,texture2D(inputBuffer,coords+vec2(-0.866,-0.5)*scale).g,texture2D(inputBuffer,coords+vec2(0.866,-0.5)*scale).b);float luminance=linearToRelativeLuminance(c);float threshold=max((luminance-luminanceThreshold)*luminanceGain,0.0);return c+mix(vec3(0.0),c,threshold*blur);}float gather(const in float i,const in float j,const in float ringSamples,const in vec2 uv,const in vec2 blurFactor,const in float blur,inout vec3 color){float step=PI2/ringSamples;vec2 wh=vec2(cos(j*step)*i,sin(j*step)*i);\n#ifdef PENTAGON\nfloat p=pentagon(wh);\n#else\nfloat p=1.0;\n#endif\ncolor+=processTexel(wh*blurFactor+uv,blur)*mix(1.0,i/RINGS_FLOAT,bias)*p;return mix(1.0,i/RINGS_FLOAT,bias)*p;}void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(depth,cameraNear,cameraFar);float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);\n#else\nfloat linearDepth=depth;\n#endif\n#ifdef MANUAL_DOF\nfloat focalPlane=linearDepth-focus;float farDoF=(focalPlane-dof.z)/dof.w;float nearDoF=(-focalPlane-dof.x)/dof.y;float blur=(focalPlane>0.0)?farDoF:nearDoF;\n#else\nconst float CIRCLE_OF_CONFUSION=0.03;float focalPlaneMM=focus*1000.0;float depthMM=linearDepth*1000.0;float focalPlane=(depthMM*focalLength)/(depthMM-focalLength);float farDoF=(focalPlaneMM*focalLength)/(focalPlaneMM-focalLength);float nearDoF=(focalPlaneMM-focalLength)/(focalPlaneMM*fStop*CIRCLE_OF_CONFUSION);float blur=abs(focalPlane-farDoF)*nearDoF;\n#endif\nconst int MAX_RING_SAMPLES=RINGS_INT*SAMPLES_INT;blur=clamp(blur,0.0,1.0);vec3 color=inputColor.rgb;if(blur>=0.05){vec2 blurFactor=blur*maxBlur*texelSize;float s=1.0;int ringSamples;for(int i=1;i<=RINGS_INT;i++){ringSamples=i*SAMPLES_INT;for(int j=0;j<MAX_RING_SAMPLES;j++){if(j>=ringSamples){break;}s+=gather(float(i),float(j),float(ringSamples),uv,blurFactor,blur,color);}}color/=s;}\n#ifdef SHOW_FOCUS\nfloat edge=0.002*linearDepth;float m=clamp(smoothstep(0.0,edge,blur),0.0,1.0);float e=clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);color=mix(color,vec3(1.0,0.5,0.0),(1.0-m)*0.6);color=mix(color,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);\n#endif\noutputColor=vec4(color,inputColor.a);}";

// src/effects/RealisticBokehEffect.js
var RealisticBokehEffect = class extends Effect {
  /**
   * Constructs a new bokeh effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.focus=1.0] - The focus distance in world units.
   * @param {Number} [options.focalLength=24.0] - The focal length of the main camera.
   * @param {Number} [options.fStop=0.9] - The ratio of the lens focal length to the diameter of the entrance pupil (aperture).
   * @param {Number} [options.luminanceThreshold=0.5] - A luminance threshold.
   * @param {Number} [options.luminanceGain=2.0] - A luminance gain factor.
   * @param {Number} [options.bias=0.5] - A blur bias.
   * @param {Number} [options.fringe=0.7] - A blur offset.
   * @param {Number} [options.maxBlur=1.0] - The maximum blur strength.
   * @param {Boolean} [options.rings=3] - The number of blur iterations.
   * @param {Boolean} [options.samples=2] - The amount of samples taken per ring.
   * @param {Boolean} [options.showFocus=false] - Whether the focal point should be highlighted. Useful for debugging.
   * @param {Boolean} [options.manualDoF=false] - Enables manual control over the depth of field.
   * @param {Boolean} [options.pentagon=false] - Enables pentagonal blur shapes. Requires a high number of rings and samples.
   */
  constructor({
    blendFunction,
    focus = 1,
    focalLength = 24,
    fStop = 0.9,
    luminanceThreshold = 0.5,
    luminanceGain = 2,
    bias = 0.5,
    fringe = 0.7,
    maxBlur = 1,
    rings = 3,
    samples = 2,
    showFocus = false,
    manualDoF = false,
    pentagon = false
  } = {}) {
    super("RealisticBokehEffect", realistic_bokeh_default, {
      blendFunction,
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["focus", new Uniform41(focus)],
        ["focalLength", new Uniform41(focalLength)],
        ["fStop", new Uniform41(fStop)],
        ["luminanceThreshold", new Uniform41(luminanceThreshold)],
        ["luminanceGain", new Uniform41(luminanceGain)],
        ["bias", new Uniform41(bias)],
        ["fringe", new Uniform41(fringe)],
        ["maxBlur", new Uniform41(maxBlur)],
        ["dof", new Uniform41(null)]
      ])
    });
    this.rings = rings;
    this.samples = samples;
    this.showFocus = showFocus;
    this.manualDoF = manualDoF;
    this.pentagon = pentagon;
  }
  /**
   * The amount of blur iterations.
   *
   * @type {Number}
   */
  get rings() {
    return Number.parseInt(this.defines.get("RINGS_INT"));
  }
  set rings(value) {
    const r = Math.floor(value);
    this.defines.set("RINGS_INT", r.toFixed(0));
    this.defines.set("RINGS_FLOAT", r.toFixed(1));
    this.setChanged();
  }
  /**
   * The amount of blur samples per ring.
   *
   * @type {Number}
   */
  get samples() {
    return Number.parseInt(this.defines.get("SAMPLES_INT"));
  }
  set samples(value) {
    const s = Math.floor(value);
    this.defines.set("SAMPLES_INT", s.toFixed(0));
    this.defines.set("SAMPLES_FLOAT", s.toFixed(1));
    this.setChanged();
  }
  /**
   * Indicates whether the focal point will be highlighted.
   *
   * @type {Boolean}
   */
  get showFocus() {
    return this.defines.has("SHOW_FOCUS");
  }
  set showFocus(value) {
    if (this.showFocus !== value) {
      if (value) {
        this.defines.set("SHOW_FOCUS", "1");
      } else {
        this.defines.delete("SHOW_FOCUS");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the Depth of Field should be calculated manually.
   *
   * If enabled, the Depth of Field can be adjusted via the `dof` uniform.
   *
   * @type {Boolean}
   */
  get manualDoF() {
    return this.defines.has("MANUAL_DOF");
  }
  set manualDoF(value) {
    if (this.manualDoF !== value) {
      if (value) {
        this.defines.set("MANUAL_DOF", "1");
        this.uniforms.get("dof").value = new Vector44(0.2, 1, 0.2, 2);
      } else {
        this.defines.delete("MANUAL_DOF");
        this.uniforms.get("dof").value = null;
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the blur shape should be pentagonal.
   *
   * @type {Boolean}
   */
  get pentagon() {
    return this.defines.has("PENTAGON");
  }
  set pentagon(value) {
    if (this.pentagon !== value) {
      if (value) {
        this.defines.set("PENTAGON", "1");
      } else {
        this.defines.delete("PENTAGON");
      }
      this.setChanged();
    }
  }
};

// src/effects/ScanlineEffect.js
import { Uniform as Uniform42, Vector2 as Vector225 } from "three";

// src/effects/glsl/scanlines.frag
var scanlines_default = "uniform float count;\n#ifdef SCROLL\nuniform float scrollSpeed;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float y=uv.y;\n#ifdef SCROLL\ny+=time*scrollSpeed;\n#endif\nvec2 sl=vec2(sin(y*count),cos(y*count));outputColor=vec4(sl.xyx,inputColor.a);}";

// src/effects/ScanlineEffect.js
var ScanlineEffect = class extends Effect {
  /**
   * Constructs a new scanline effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
   * @param {Number} [options.density=1.25] - The scanline density.
   * @param {Number} [options.scrollSpeed=0.0] - The scanline scroll speed.
   */
  constructor({ blendFunction = BlendFunction.OVERLAY, density = 1.25, scrollSpeed = 0 } = {}) {
    super("ScanlineEffect", scanlines_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["count", new Uniform42(0)],
        ["scrollSpeed", new Uniform42(0)]
      ])
    });
    this.resolution = new Vector225();
    this.d = density;
    this.scrollSpeed = scrollSpeed;
  }
  /**
   * The scanline density.
   *
   * @type {Number}
   */
  get density() {
    return this.d;
  }
  set density(value) {
    this.d = value;
    this.setSize(this.resolution.width, this.resolution.height);
  }
  /**
   * Returns the current scanline density.
   *
   * @deprecated Use density instead.
   * @return {Number} The scanline density.
   */
  getDensity() {
    return this.density;
  }
  /**
   * Sets the scanline density.
   *
   * @deprecated Use density instead.
   * @param {Number} value - The new scanline density.
   */
  setDensity(value) {
    this.density = value;
  }
  /**
   * The scanline scroll speed. Default is 0 (disabled).
   *
   * @type {Number}
   */
  get scrollSpeed() {
    return this.uniforms.get("scrollSpeed").value;
  }
  set scrollSpeed(value) {
    this.uniforms.get("scrollSpeed").value = value;
    if (value === 0) {
      if (this.defines.delete("SCROLL")) {
        this.setChanged();
      }
    } else if (!this.defines.has("SCROLL")) {
      this.defines.set("SCROLL", "1");
      this.setChanged();
    }
  }
  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.resolution.set(width, height);
    this.uniforms.get("count").value = Math.round(height * this.density);
  }
};

// src/effects/ShockWaveEffect.js
import { Uniform as Uniform43, Vector2 as Vector226, Vector3 as Vector35 } from "three";

// src/effects/glsl/shock-wave.frag
var shock_wave_default = "uniform bool active;uniform vec2 center;uniform float waveSize;uniform float radius;uniform float maxRadius;uniform float amplitude;varying float vSize;void mainUv(inout vec2 uv){if(active){vec2 aspectCorrection=vec2(aspect,1.0);vec2 difference=uv*aspectCorrection-center*aspectCorrection;float distance=sqrt(dot(difference,difference))*vSize;if(distance>radius){if(distance<radius+waveSize){float angle=(distance-radius)*PI2/waveSize;float cosSin=(1.0-cos(angle))*0.5;float extent=maxRadius+waveSize;float decay=max(extent-distance*distance,0.0)/extent;uv-=((cosSin*amplitude*difference)/distance)*decay;}}}}";

// src/effects/glsl/shock-wave.vert
var shock_wave_default2 = "uniform float size;uniform float cameraDistance;varying float vSize;void mainSupport(){vSize=(0.1*cameraDistance)/size;}";

// src/effects/ShockWaveEffect.js
var HALF_PI = Math.PI * 0.5;
var v2 = /* @__PURE__ */ new Vector35();
var ab = /* @__PURE__ */ new Vector35();
var ShockWaveEffect = class extends Effect {
  /**
   * Constructs a new shock wave effect.
   *
   * @param {Camera} camera - The main camera.
   * @param {Vector3} [position] - The world position of the shock wave.
   * @param {Object} [options] - The options.
   * @param {Number} [options.speed=2.0] - The animation speed.
   * @param {Number} [options.maxRadius=1.0] - The extent of the shock wave.
   * @param {Number} [options.waveSize=0.2] - The wave size.
   * @param {Number} [options.amplitude=0.05] - The distortion amplitude.
   */
  constructor(camera, position = new Vector35(), {
    speed = 2,
    maxRadius = 1,
    waveSize = 0.2,
    amplitude = 0.05
  } = {}) {
    super("ShockWaveEffect", shock_wave_default, {
      vertexShader: shock_wave_default2,
      uniforms: /* @__PURE__ */ new Map([
        ["active", new Uniform43(false)],
        ["center", new Uniform43(new Vector226(0.5, 0.5))],
        ["cameraDistance", new Uniform43(1)],
        ["size", new Uniform43(1)],
        ["radius", new Uniform43(-waveSize)],
        ["maxRadius", new Uniform43(maxRadius)],
        ["waveSize", new Uniform43(waveSize)],
        ["amplitude", new Uniform43(amplitude)]
      ])
    });
    this.position = position;
    this.speed = speed;
    this.camera = camera;
    this.screenPosition = this.uniforms.get("center").value;
    this.time = 0;
    this.active = false;
  }
  set mainCamera(value) {
    this.camera = value;
  }
  /**
   * The amplitude.
   *
   * @type {Number}
   */
  get amplitude() {
    return this.uniforms.get("amplitude").value;
  }
  set amplitude(value) {
    this.uniforms.get("amplitude").value = value;
  }
  /**
   * The wave size.
   *
   * @type {Number}
   */
  get waveSize() {
    return this.uniforms.get("waveSize").value;
  }
  set waveSize(value) {
    this.uniforms.get("waveSize").value = value;
  }
  /**
   * The maximum radius.
   *
   * @type {Number}
   */
  get maxRadius() {
    return this.uniforms.get("maxRadius").value;
  }
  set maxRadius(value) {
    this.uniforms.get("maxRadius").value = value;
  }
  /**
   * The position of the shock wave.
   *
   * @type {Vector3}
   * @deprecated Use position instead.
   */
  get epicenter() {
    return this.position;
  }
  set epicenter(value) {
    this.position = value;
  }
  /**
   * Returns the position of the shock wave.
   *
   * @deprecated Use position instead.
   * @return {Vector3} The position.
   */
  getPosition() {
    return this.position;
  }
  /**
   * Sets the position of the shock wave.
   *
   * @deprecated Use position instead.
   * @param {Vector3} value - The position.
   */
  setPosition(value) {
    this.position = value;
  }
  /**
   * Returns the speed of the shock wave.
   *
   * @deprecated Use speed instead.
   * @return {Number} The speed.
   */
  getSpeed() {
    return this.speed;
  }
  /**
   * Sets the speed of the shock wave.
   *
   * @deprecated Use speed instead.
   * @param {Number} value - The speed.
   */
  setSpeed(value) {
    this.speed = value;
  }
  /**
   * Emits the shock wave.
   */
  explode() {
    this.time = 0;
    this.active = true;
    this.uniforms.get("active").value = true;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [delta] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, delta) {
    const position = this.position;
    const camera = this.camera;
    const uniforms = this.uniforms;
    const uActive = uniforms.get("active");
    if (this.active) {
      const waveSize = uniforms.get("waveSize").value;
      camera.getWorldDirection(v2);
      ab.copy(camera.position).sub(position);
      uActive.value = v2.angleTo(ab) > HALF_PI;
      if (uActive.value) {
        uniforms.get("cameraDistance").value = camera.position.distanceTo(position);
        v2.copy(position).project(camera);
        this.screenPosition.set((v2.x + 1) * 0.5, (v2.y + 1) * 0.5);
      }
      this.time += delta * this.speed;
      const radius = this.time - waveSize;
      uniforms.get("radius").value = radius;
      if (radius >= (uniforms.get("maxRadius").value + waveSize) * 2) {
        this.active = false;
        uActive.value = false;
      }
    }
  }
};

// src/effects/SelectiveBloomEffect.js
import {
  BasicDepthPacking as BasicDepthPacking16,
  Color as Color7,
  NotEqualDepth as NotEqualDepth2,
  EqualDepth as EqualDepth2,
  RGBADepthPacking as RGBADepthPacking5,
  WebGLRenderTarget as WebGLRenderTarget19
} from "three";
var SelectiveBloomEffect = class extends BloomEffect {
  /**
   * Constructs a new selective bloom effect.
   *
   * @param {Scene} scene - The main scene.
   * @param {Camera} camera - The main camera.
   * @param {Object} [options] - The options. See {@link BloomEffect} for details.
   */
  constructor(scene, camera, options) {
    super(options);
    this.setAttributes(this.getAttributes() | EffectAttribute.DEPTH);
    this.camera = camera;
    this.depthPass = new DepthPass(scene, camera);
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color7(0);
    this.depthMaskPass = new ShaderPass(new DepthMaskMaterial());
    const depthMaskMaterial = this.depthMaskMaterial;
    depthMaskMaterial.copyCameraSettings(camera);
    depthMaskMaterial.depthBuffer1 = this.depthPass.texture;
    depthMaskMaterial.depthPacking1 = RGBADepthPacking5;
    depthMaskMaterial.depthMode = EqualDepth2;
    this.renderTargetMasked = new WebGLRenderTarget19(1, 1, { depthBuffer: false });
    this.renderTargetMasked.texture.name = "Bloom.Masked";
    this.selection = new Selection();
    this.selection.layer = 11;
    this._inverted = false;
    this._ignoreBackground = false;
  }
  set mainScene(value) {
    this.depthPass.mainScene = value;
  }
  set mainCamera(value) {
    this.camera = value;
    this.depthPass.mainCamera = value;
    this.depthMaskMaterial.copyCameraSettings(value);
  }
  /**
   * Returns the selection.
   *
   * @deprecated Use selection instead.
   * @return {Selection} The selection.
   */
  getSelection() {
    return this.selection;
  }
  /**
   * The depth mask material.
   *
   * @type {DepthMaskMaterial}
   * @private
   */
  get depthMaskMaterial() {
    return this.depthMaskPass.fullscreenMaterial;
  }
  /**
   * Indicates whether the selection should be considered inverted.
   *
   * @type {Boolean}
   */
  get inverted() {
    return this._inverted;
  }
  set inverted(value) {
    this._inverted = value;
    this.depthMaskMaterial.depthMode = value ? NotEqualDepth2 : EqualDepth2;
  }
  /**
   * Indicates whether the mask is inverted.
   *
   * @deprecated Use inverted instead.
   * @return {Boolean} Whether the mask is inverted.
   */
  isInverted() {
    return this.inverted;
  }
  /**
   * Enables or disable mask inversion.
   *
   * @deprecated Use inverted instead.
   * @param {Boolean} value - Whether the mask should be inverted.
   */
  setInverted(value) {
    this.inverted = value;
  }
  /**
   * Indicates whether the background colors will be ignored.
   *
   * @type {Boolean}
   */
  get ignoreBackground() {
    return this._ignoreBackground;
  }
  set ignoreBackground(value) {
    this._ignoreBackground = value;
    this.depthMaskMaterial.maxDepthStrategy = value ? DepthTestStrategy.DISCARD_MAX_DEPTH : DepthTestStrategy.KEEP_MAX_DEPTH;
  }
  /**
   * Indicates whether the background is disabled.
   *
   * @deprecated Use ignoreBackground instead.
   * @return {Boolean} Whether the background is disabled.
   */
  isBackgroundDisabled() {
    return this.ignoreBackground;
  }
  /**
   * Enables or disables the background.
   *
   * @deprecated Use ignoreBackground instead.
   * @param {Boolean} value - Whether the background should be disabled.
   */
  setBackgroundDisabled(value) {
    this.ignoreBackground = value;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking16) {
    this.depthMaskMaterial.depthBuffer0 = depthTexture;
    this.depthMaskMaterial.depthPacking0 = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const camera = this.camera;
    const selection = this.selection;
    const inverted = this.inverted;
    let renderTarget = inputBuffer;
    if (this.ignoreBackground || !inverted || selection.size > 0) {
      const mask = camera.layers.mask;
      camera.layers.set(selection.layer);
      this.depthPass.render(renderer);
      camera.layers.mask = mask;
      renderTarget = this.renderTargetMasked;
      this.clearPass.render(renderer, renderTarget);
      this.depthMaskPass.render(renderer, inputBuffer, renderTarget);
    }
    super.update(renderer, renderTarget, deltaTime);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    super.setSize(width, height);
    this.renderTargetMasked.setSize(width, height);
    this.depthPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    super.initialize(renderer, alpha, frameBufferType);
    this.clearPass.initialize(renderer, alpha, frameBufferType);
    this.depthPass.initialize(renderer, alpha, frameBufferType);
    this.depthMaskPass.initialize(renderer, alpha, frameBufferType);
    if (renderer.capabilities.logarithmicDepthBuffer) {
      this.depthMaskPass.fullscreenMaterial.defines.LOG_DEPTH = "1";
    }
    if (frameBufferType !== void 0) {
      this.renderTargetMasked.texture.type = frameBufferType;
      if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTargetMasked.texture, SRGBColorSpace);
      }
    }
  }
};

// src/effects/SepiaEffect.js
import { Uniform as Uniform44, Vector3 as Vector36 } from "three";

// src/effects/glsl/sepia.frag
var sepia_default = "uniform vec3 weightsR;uniform vec3 weightsG;uniform vec3 weightsB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(dot(inputColor.rgb,weightsR),dot(inputColor.rgb,weightsG),dot(inputColor.rgb,weightsB));outputColor=vec4(color,inputColor.a);}";

// src/effects/SepiaEffect.js
var SepiaEffect = class extends Effect {
  /**
   * Constructs a new sepia effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.intensity=1.0] - The intensity of the effect.
   */
  constructor({ blendFunction, intensity = 1 } = {}) {
    super("SepiaEffect", sepia_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["weightsR", new Uniform44(new Vector36(0.393, 0.769, 0.189))],
        ["weightsG", new Uniform44(new Vector36(0.349, 0.686, 0.168))],
        ["weightsB", new Uniform44(new Vector36(0.272, 0.534, 0.131))]
      ])
    });
  }
  /**
   * The intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @type {Number}
   */
  get intensity() {
    return this.blendMode.opacity.value;
  }
  set intensity(value) {
    this.blendMode.opacity.value = value;
  }
  /**
   * Returns the current sepia intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @return {Number} The intensity.
   */
  getIntensity() {
    return this.intensity;
  }
  /**
   * Sets the sepia intensity.
   *
   * @deprecated Use blendMode.opacity instead.
   * @param {Number} value - The intensity.
   */
  setIntensity(value) {
    this.intensity = value;
  }
  /**
   * The weights for the red channel. Default is `(0.393, 0.769, 0.189)`.
   *
   * @type {Vector3}
   */
  get weightsR() {
    return this.uniforms.get("weightsR").value;
  }
  /**
   * The weights for the green channel. Default is `(0.349, 0.686, 0.168)`.
   *
   * @type {Vector3}
   */
  get weightsG() {
    return this.uniforms.get("weightsG").value;
  }
  /**
   * The weights for the blue channel. Default is `(0.272, 0.534, 0.131)`.
   *
   * @type {Vector3}
   */
  get weightsB() {
    return this.uniforms.get("weightsB").value;
  }
};

// src/effects/SMAAEffect.js
import {
  BasicDepthPacking as BasicDepthPacking17,
  Color as Color8,
  LinearFilter as LinearFilter5,
  LoadingManager as LoadingManager2,
  NearestFilter as NearestFilter8,
  Texture as Texture3,
  Uniform as Uniform45,
  WebGLRenderTarget as WebGLRenderTarget20
} from "three";

// src/textures/smaa/searchImageDataURL.js
var searchImageDataURL_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAYAAACm53kpAAAAeElEQVRYR+2XSwqAMAxEJ168ePEqwRSKhIIiuHjJqiU0gWE+1CQdApcVAMUAuARaMGCX1MIL/Ow13++9lW2s3mW9MWvsnWc/2fvGygwPAN4E8QzAA4CXAB6AHjG4JTHYI1ey3pcx6FHnEfhLDOIBKAmUBK6/ANUDTlROXAHd9EC1AAAAAElFTkSuQmCC";

// src/textures/smaa/areaImageDataURL.js
var areaImageDataURL_default = "data:image/png;base64,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";

// src/effects/glsl/smaa.frag
var smaa_default = "uniform sampler2D weightMap;varying vec2 vOffset0;varying vec2 vOffset1;void movec(const in bvec2 c,inout vec2 variable,const in vec2 value){if(c.x){variable.x=value.x;}if(c.y){variable.y=value.y;}}void movec(const in bvec4 c,inout vec4 variable,const in vec4 value){movec(c.xy,variable.xy,value.xy);movec(c.zw,variable.zw,value.zw);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec4 a;a.x=texture2D(weightMap,vOffset0).a;a.y=texture2D(weightMap,vOffset1).g;a.wz=texture2D(weightMap,uv).rb;vec4 color=inputColor;if(dot(a,vec4(1.0))>=1e-5){bool h=max(a.x,a.z)>max(a.y,a.w);vec4 blendingOffset=vec4(0.0,a.y,0.0,a.w);vec2 blendingWeight=a.yw;movec(bvec4(h),blendingOffset,vec4(a.x,0.0,a.z,0.0));movec(bvec2(h),blendingWeight,a.xz);blendingWeight/=dot(blendingWeight,vec2(1.0));vec4 blendingCoord=blendingOffset*vec4(texelSize,-texelSize)+uv.xyxy;color=blendingWeight.x*texture2D(inputBuffer,blendingCoord.xy);color+=blendingWeight.y*texture2D(inputBuffer,blendingCoord.zw);}outputColor=color;}";

// src/effects/glsl/smaa.vert
var smaa_default2 = "varying vec2 vOffset0;varying vec2 vOffset1;void mainSupport(const in vec2 uv){vOffset0=uv+texelSize*vec2(1.0,0.0);vOffset1=uv+texelSize*vec2(0.0,1.0);}";

// src/effects/SMAAEffect.js
var SMAAEffect = class extends Effect {
  /**
   * Constructs a new SMAA effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {SMAAPreset} [options.preset=SMAAPreset.MEDIUM] - The quality preset.
   * @param {EdgeDetectionMode} [options.edgeDetectionMode=EdgeDetectionMode.COLOR] - The edge detection mode.
   * @param {PredicationMode} [options.predicationMode=PredicationMode.DISABLED] - The predication mode.
   */
  constructor({
    blendFunction = BlendFunction.SRC,
    preset = SMAAPreset.MEDIUM,
    edgeDetectionMode = EdgeDetectionMode.COLOR,
    predicationMode = PredicationMode.DISABLED
  } = {}) {
    super("SMAAEffect", smaa_default, {
      vertexShader: smaa_default2,
      blendFunction,
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      uniforms: /* @__PURE__ */ new Map([
        ["weightMap", new Uniform45(null)]
      ])
    });
    let searchImage, areaImage;
    if (arguments.length > 1) {
      searchImage = arguments[0];
      areaImage = arguments[1];
      if (arguments.length > 2) {
        preset = arguments[2];
      }
      if (arguments.length > 3) {
        edgeDetectionMode = arguments[3];
      }
    }
    this.renderTargetEdges = new WebGLRenderTarget20(1, 1, { depthBuffer: false });
    this.renderTargetEdges.texture.name = "SMAA.Edges";
    this.renderTargetWeights = this.renderTargetEdges.clone();
    this.renderTargetWeights.texture.name = "SMAA.Weights";
    this.uniforms.get("weightMap").value = this.renderTargetWeights.texture;
    this.clearPass = new ClearPass(true, false, false);
    this.clearPass.overrideClearColor = new Color8(0);
    this.clearPass.overrideClearAlpha = 1;
    this.edgeDetectionPass = new ShaderPass(new EdgeDetectionMaterial());
    this.edgeDetectionMaterial.edgeDetectionMode = edgeDetectionMode;
    this.edgeDetectionMaterial.predicationMode = predicationMode;
    this.weightsPass = new ShaderPass(new SMAAWeightsMaterial());
    const loadingManager = new LoadingManager2();
    loadingManager.onLoad = () => {
      const searchTexture = new Texture3(searchImage);
      searchTexture.name = "SMAA.Search";
      searchTexture.magFilter = NearestFilter8;
      searchTexture.minFilter = NearestFilter8;
      searchTexture.generateMipmaps = false;
      searchTexture.needsUpdate = true;
      searchTexture.flipY = true;
      this.weightsMaterial.searchTexture = searchTexture;
      const areaTexture = new Texture3(areaImage);
      areaTexture.name = "SMAA.Area";
      areaTexture.magFilter = LinearFilter5;
      areaTexture.minFilter = LinearFilter5;
      areaTexture.generateMipmaps = false;
      areaTexture.needsUpdate = true;
      areaTexture.flipY = false;
      this.weightsMaterial.areaTexture = areaTexture;
      this.dispatchEvent({ type: "load" });
    };
    loadingManager.itemStart("search");
    loadingManager.itemStart("area");
    if (searchImage !== void 0 && areaImage !== void 0) {
      loadingManager.itemEnd("search");
      loadingManager.itemEnd("area");
    } else if (typeof Image !== "undefined") {
      searchImage = new Image();
      areaImage = new Image();
      searchImage.addEventListener("load", () => loadingManager.itemEnd("search"));
      areaImage.addEventListener("load", () => loadingManager.itemEnd("area"));
      searchImage.src = searchImageDataURL_default;
      areaImage.src = areaImageDataURL_default;
    }
    this.applyPreset(preset);
  }
  /**
   * The edges texture.
   *
   * @type {Texture}
   */
  get edgesTexture() {
    return this.renderTargetEdges.texture;
  }
  /**
   * Returns the edges texture.
   *
   * @deprecated Use edgesTexture instead.
   * @return {Texture} The texture.
   */
  getEdgesTexture() {
    return this.edgesTexture;
  }
  /**
   * The edge weights texture.
   *
   * @type {Texture}
   */
  get weightsTexture() {
    return this.renderTargetWeights.texture;
  }
  /**
   * Returns the edge weights texture.
   *
   * @deprecated Use weightsTexture instead.
   * @return {Texture} The texture.
   */
  getWeightsTexture() {
    return this.weightsTexture;
  }
  /**
   * The edge detection material.
   *
   * @type {EdgeDetectionMaterial}
   */
  get edgeDetectionMaterial() {
    return this.edgeDetectionPass.fullscreenMaterial;
  }
  /**
   * The edge detection material.
   *
   * @type {EdgeDetectionMaterial}
   * @deprecated Use edgeDetectionMaterial instead.
   */
  get colorEdgesMaterial() {
    return this.edgeDetectionMaterial;
  }
  /**
   * Returns the edge detection material.
   *
   * @deprecated Use edgeDetectionMaterial instead.
   * @return {EdgeDetectionMaterial} The material.
   */
  getEdgeDetectionMaterial() {
    return this.edgeDetectionMaterial;
  }
  /**
   * The edge weights material.
   *
   * @type {SMAAWeightsMaterial}
   */
  get weightsMaterial() {
    return this.weightsPass.fullscreenMaterial;
  }
  /**
   * Returns the edge weights material.
   *
   * @deprecated Use weightsMaterial instead.
   * @return {SMAAWeightsMaterial} The material.
   */
  getWeightsMaterial() {
    return this.weightsMaterial;
  }
  /**
   * Sets the edge detection sensitivity.
   *
   * See {@link EdgeDetectionMaterial#setEdgeDetectionThreshold} for more details.
   *
   * @deprecated Use edgeDetectionMaterial instead.
   * @param {Number} threshold - The edge detection sensitivity. Range: [0.05, 0.5].
   */
  setEdgeDetectionThreshold(threshold) {
    this.edgeDetectionMaterial.edgeDetectionThreshold = threshold;
  }
  /**
   * Sets the maximum amount of horizontal/vertical search steps.
   *
   * See {@link SMAAWeightsMaterial#setOrthogonalSearchSteps} for more details.
   *
   * @deprecated Use weightsMaterial instead.
   * @param {Number} steps - The search steps. Range: [0, 112].
   */
  setOrthogonalSearchSteps(steps) {
    this.weightsMaterial.orthogonalSearchSteps = steps;
  }
  /**
   * Applies the given quality preset.
   *
   * @param {SMAAPreset} preset - The preset.
   */
  applyPreset(preset) {
    const edgeDetectionMaterial = this.edgeDetectionMaterial;
    const weightsMaterial = this.weightsMaterial;
    switch (preset) {
      case SMAAPreset.LOW:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.15;
        weightsMaterial.orthogonalSearchSteps = 4;
        weightsMaterial.diagonalDetection = false;
        weightsMaterial.cornerDetection = false;
        break;
      case SMAAPreset.MEDIUM:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.1;
        weightsMaterial.orthogonalSearchSteps = 8;
        weightsMaterial.diagonalDetection = false;
        weightsMaterial.cornerDetection = false;
        break;
      case SMAAPreset.HIGH:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.1;
        weightsMaterial.orthogonalSearchSteps = 16;
        weightsMaterial.diagonalSearchSteps = 8;
        weightsMaterial.cornerRounding = 25;
        weightsMaterial.diagonalDetection = true;
        weightsMaterial.cornerDetection = true;
        break;
      case SMAAPreset.ULTRA:
        edgeDetectionMaterial.edgeDetectionThreshold = 0.05;
        weightsMaterial.orthogonalSearchSteps = 32;
        weightsMaterial.diagonalSearchSteps = 16;
        weightsMaterial.cornerRounding = 25;
        weightsMaterial.diagonalDetection = true;
        weightsMaterial.cornerDetection = true;
        break;
    }
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking17) {
    this.edgeDetectionMaterial.depthBuffer = depthTexture;
    this.edgeDetectionMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    this.clearPass.render(renderer, this.renderTargetEdges);
    this.edgeDetectionPass.render(renderer, inputBuffer, this.renderTargetEdges);
    this.weightsPass.render(renderer, this.renderTargetEdges, this.renderTargetWeights);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    this.edgeDetectionMaterial.setSize(width, height);
    this.weightsMaterial.setSize(width, height);
    this.renderTargetEdges.setSize(width, height);
    this.renderTargetWeights.setSize(width, height);
  }
  /**
   * Deletes internal render targets and textures.
   */
  dispose() {
    const { searchTexture, areaTexture } = this.weightsMaterial;
    if (searchTexture !== null && areaTexture !== null) {
      searchTexture.dispose();
      areaTexture.dispose();
    }
    super.dispose();
  }
  /**
   * The SMAA search image, encoded as a base64 data URL.
   *
   * @type {String}
   * @deprecated
   */
  static get searchImageDataURL() {
    return searchImageDataURL_default;
  }
  /**
   * The SMAA area image, encoded as a base64 data URL.
   *
   * @type {String}
   * @deprecated
   */
  static get areaImageDataURL() {
    return areaImageDataURL_default;
  }
};

// src/effects/SSAOEffect.js
import { BasicDepthPacking as BasicDepthPacking18, Color as Color9, RepeatWrapping as RepeatWrapping3, RGBAFormat as RGBAFormat4, Uniform as Uniform46, WebGLRenderTarget as WebGLRenderTarget21 } from "three";

// src/effects/glsl/ssao.frag
var ssao_default3 = "uniform lowp sampler2D aoBuffer;uniform float luminanceInfluence;uniform float intensity;\n#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\n#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH)\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D normalDepthBuffer;\n#else\nuniform mediump sampler2D normalDepthBuffer;\n#endif\n#endif\n#ifdef COLORIZE\nuniform vec3 color;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){float aoLinear=texture2D(aoBuffer,uv).r;\n#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH) && __VERSION__ == 300\nvec4 normalDepth[4];normalDepth[0]=textureOffset(normalDepthBuffer,uv,ivec2(0,0));normalDepth[1]=textureOffset(normalDepthBuffer,uv,ivec2(0,1));normalDepth[2]=textureOffset(normalDepthBuffer,uv,ivec2(1,0));normalDepth[3]=textureOffset(normalDepthBuffer,uv,ivec2(1,1));float dot01=dot(normalDepth[0].rgb,normalDepth[1].rgb);float dot02=dot(normalDepth[0].rgb,normalDepth[2].rgb);float dot03=dot(normalDepth[0].rgb,normalDepth[3].rgb);float minDot=min(dot01,min(dot02,dot03));float s=step(THRESHOLD,minDot);float smallestDistance=1.0;int index;for(int i=0;i<4;++i){float distance=abs(depth-normalDepth[i].a);if(distance<smallestDistance){smallestDistance=distance;index=i;}}ivec2 offsets[4];offsets[0]=ivec2(0,0);offsets[1]=ivec2(0,1);offsets[2]=ivec2(1,0);offsets[3]=ivec2(1,1);ivec2 coord=ivec2(uv*vec2(textureSize(aoBuffer,0)))+offsets[index];float aoNearest=texelFetch(aoBuffer,coord,0).r;float ao=mix(aoNearest,aoLinear,s);\n#else\nfloat ao=aoLinear;\n#endif\nfloat l=luminance(inputColor.rgb);ao=mix(ao,0.0,l*luminanceInfluence);ao=clamp(ao*intensity,0.0,1.0);\n#ifdef COLORIZE\noutputColor=vec4(1.0-ao*(1.0-color),inputColor.a);\n#else\noutputColor=vec4(vec3(1.0-ao),inputColor.a);\n#endif\n}";

// src/effects/SSAOEffect.js
var NOISE_TEXTURE_SIZE = 64;
var SSAOEffect = class extends Effect {
  /**
   * Constructs a new SSAO effect.
   *
   * @todo Move normalBuffer to options.
   * @param {Camera} [camera] - The main camera.
   * @param {Texture} [normalBuffer] - A texture that contains the scene normals.
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.MULTIPLY] - The blend function of this effect.
   * @param {Boolean} [options.distanceScaling=true] - Deprecated.
   * @param {Boolean} [options.depthAwareUpsampling=true] - Enables or disables depth-aware upsampling. Has no effect if WebGL 2 is not supported.
   * @param {Texture} [options.normalDepthBuffer=null] - Deprecated.
   * @param {Number} [options.samples=9] - The amount of samples per pixel. Should not be a multiple of the ring count.
   * @param {Number} [options.rings=7] - The amount of spiral turns in the occlusion sampling pattern. Should be a prime number.
   * @param {Number} [options.worldDistanceThreshold] - The world distance threshold at which the occlusion effect starts to fade out.
   * @param {Number} [options.worldDistanceFalloff] - The world distance falloff. Influences the smoothness of the occlusion cutoff.
   * @param {Number} [options.worldProximityThreshold] - The world proximity threshold at which the occlusion starts to fade out.
   * @param {Number} [options.worldProximityFalloff] - The world proximity falloff. Influences the smoothness of the proximity cutoff.
   * @param {Number} [options.distanceThreshold=0.97] - Deprecated.
   * @param {Number} [options.distanceFalloff=0.03] - Deprecated.
   * @param {Number} [options.rangeThreshold=0.0005] - Deprecated.
   * @param {Number} [options.rangeFalloff=0.001] - Deprecated.
   * @param {Number} [options.minRadiusScale=0.1] - The minimum radius scale.
   * @param {Number} [options.luminanceInfluence=0.7] - Determines how much the luminance of the scene influences the ambient occlusion.
   * @param {Number} [options.radius=0.1825] - The occlusion sampling radius, expressed as a scale relative to the resolution. Range [1e-6, 1.0].
   * @param {Number} [options.intensity=1.0] - The intensity of the ambient occlusion.
   * @param {Number} [options.bias=0.025] - An occlusion bias. Eliminates artifacts caused by depth discontinuities.
   * @param {Number} [options.fade=0.01] - Influences the smoothness of the shadows. A lower value results in higher contrast.
   * @param {Color} [options.color=null] - The color of the ambient occlusion.
   * @param {Number} [options.resolutionScale=1.0] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   * @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
   * @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
   */
  constructor(camera, normalBuffer, {
    blendFunction = BlendFunction.MULTIPLY,
    samples = 9,
    rings = 7,
    normalDepthBuffer = null,
    depthAwareUpsampling = true,
    worldDistanceThreshold,
    worldDistanceFalloff,
    worldProximityThreshold,
    worldProximityFalloff,
    distanceThreshold = 0.97,
    distanceFalloff = 0.03,
    rangeThreshold = 5e-4,
    rangeFalloff = 1e-3,
    minRadiusScale = 0.1,
    luminanceInfluence = 0.7,
    radius = 0.1825,
    intensity = 1,
    bias = 0.025,
    fade = 0.01,
    color: color2 = null,
    resolutionScale = 1,
    width = Resolution.AUTO_SIZE,
    height = Resolution.AUTO_SIZE,
    resolutionX = width,
    resolutionY = height
  } = {}) {
    super("SSAOEffect", ssao_default3, {
      blendFunction,
      attributes: EffectAttribute.DEPTH,
      defines: /* @__PURE__ */ new Map([
        ["THRESHOLD", "0.997"]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["aoBuffer", new Uniform46(null)],
        ["normalDepthBuffer", new Uniform46(normalDepthBuffer)],
        ["luminanceInfluence", new Uniform46(luminanceInfluence)],
        ["color", new Uniform46(null)],
        ["intensity", new Uniform46(intensity)],
        ["scale", new Uniform46(0)]
        // Unused.
      ])
    });
    this.renderTarget = new WebGLRenderTarget21(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "AO.Target";
    this.uniforms.get("aoBuffer").value = this.renderTarget.texture;
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.camera = camera;
    this.depthDownsamplingPass = new DepthDownsamplingPass({ normalBuffer, resolutionScale });
    this.depthDownsamplingPass.enabled = normalDepthBuffer === null;
    this.ssaoPass = new ShaderPass(new SSAOMaterial(camera));
    const noiseTexture = new NoiseTexture(NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, RGBAFormat4);
    noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping3;
    const ssaoMaterial = this.ssaoMaterial;
    ssaoMaterial.normalBuffer = normalBuffer;
    ssaoMaterial.noiseTexture = noiseTexture;
    ssaoMaterial.minRadiusScale = minRadiusScale;
    ssaoMaterial.samples = samples;
    ssaoMaterial.radius = radius;
    ssaoMaterial.rings = rings;
    ssaoMaterial.fade = fade;
    ssaoMaterial.bias = bias;
    ssaoMaterial.distanceThreshold = distanceThreshold;
    ssaoMaterial.distanceFalloff = distanceFalloff;
    ssaoMaterial.proximityThreshold = rangeThreshold;
    ssaoMaterial.proximityFalloff = rangeFalloff;
    if (worldDistanceThreshold !== void 0) {
      ssaoMaterial.worldDistanceThreshold = worldDistanceThreshold;
    }
    if (worldDistanceFalloff !== void 0) {
      ssaoMaterial.worldDistanceFalloff = worldDistanceFalloff;
    }
    if (worldProximityThreshold !== void 0) {
      ssaoMaterial.worldProximityThreshold = worldProximityThreshold;
    }
    if (worldProximityFalloff !== void 0) {
      ssaoMaterial.worldProximityFalloff = worldProximityFalloff;
    }
    if (normalDepthBuffer !== null) {
      this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
      this.defines.set("NORMAL_DEPTH", "1");
    }
    this.depthAwareUpsampling = depthAwareUpsampling;
    this.color = color2;
  }
  set mainCamera(value) {
    this.camera = value;
    this.ssaoMaterial.copyCameraSettings(value);
  }
  /**
   * Sets the normal buffer.
   *
   * @type {Texture}
   */
  get normalBuffer() {
    return this.ssaoMaterial.normalBuffer;
  }
  set normalBuffer(value) {
    this.ssaoMaterial.normalBuffer = value;
    this.depthDownsamplingPass.fullscreenMaterial.normalBuffer = value;
  }
  /**
   * Returns the resolution settings.
   *
   * @deprecated Use resolution instead.
   * @return {Resolution} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * The SSAO material.
   *
   * @type {SSAOMaterial}
   */
  get ssaoMaterial() {
    return this.ssaoPass.fullscreenMaterial;
  }
  /**
   * Returns the SSAO material.
   *
   * @deprecated Use ssaoMaterial instead.
   * @return {SSAOMaterial} The material.
   */
  getSSAOMaterial() {
    return this.ssaoMaterial;
  }
  /**
   * The amount of occlusion samples per pixel.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.samples instead.
   */
  get samples() {
    return this.ssaoMaterial.samples;
  }
  set samples(value) {
    this.ssaoMaterial.samples = value;
  }
  /**
   * The amount of spiral turns in the occlusion sampling pattern.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.rings instead.
   */
  get rings() {
    return this.ssaoMaterial.rings;
  }
  set rings(value) {
    this.ssaoMaterial.rings = value;
  }
  /**
   * The occlusion sampling radius.
   *
   * @type {Number}
   * @deprecated Use ssaoMaterial.radius instead.
   */
  get radius() {
    return this.ssaoMaterial.radius;
  }
  set radius(value) {
    this.ssaoMaterial.radius = value;
  }
  /**
   * Indicates whether depth-aware upsampling is enabled.
   *
   * @type {Boolean}
   */
  get depthAwareUpsampling() {
    return this.defines.has("DEPTH_AWARE_UPSAMPLING");
  }
  set depthAwareUpsampling(value) {
    if (this.depthAwareUpsampling !== value) {
      if (value) {
        this.defines.set("DEPTH_AWARE_UPSAMPLING", "1");
      } else {
        this.defines.delete("DEPTH_AWARE_UPSAMPLING");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether depth-aware upsampling is enabled.
   *
   * @deprecated Use depthAwareUpsampling instead.
   * @return {Boolean} Whether depth-aware upsampling is enabled.
   */
  isDepthAwareUpsamplingEnabled() {
    return this.depthAwareUpsampling;
  }
  /**
   * Enables or disables depth-aware upsampling.
   *
   * @deprecated Use depthAwareUpsampling instead.
   * @param {Boolean} value - Whether depth-aware upsampling should be enabled.
   */
  setDepthAwareUpsamplingEnabled(value) {
    this.depthAwareUpsampling = value;
  }
  /**
   * Indicates whether distance-based radius scaling is enabled.
   *
   * @type {Boolean}
   * @deprecated
   */
  get distanceScaling() {
    return true;
  }
  set distanceScaling(value) {
  }
  /**
   * The color of the ambient occlusion. Set to `null` to disable.
   *
   * @type {Color}
   */
  get color() {
    return this.uniforms.get("color").value;
  }
  set color(value) {
    const uniforms = this.uniforms;
    const defines = this.defines;
    if (value !== null) {
      if (defines.has("COLORIZE")) {
        uniforms.get("color").value.set(value);
      } else {
        defines.set("COLORIZE", "1");
        uniforms.get("color").value = new Color9(value);
        this.setChanged();
      }
    } else if (defines.has("COLORIZE")) {
      defines.delete("COLORIZE");
      uniforms.get("color").value = null;
      this.setChanged();
    }
  }
  /**
   * The luminance influence factor. Range: [0.0, 1.0].
   *
   * @type {Boolean}
   */
  get luminanceInfluence() {
    return this.uniforms.get("luminanceInfluence").value;
  }
  set luminanceInfluence(value) {
    this.uniforms.get("luminanceInfluence").value = value;
  }
  /**
   * The intensity.
   *
   * @type {Number}
   */
  get intensity() {
    return this.uniforms.get("intensity").value;
  }
  set intensity(value) {
    this.uniforms.get("intensity").value = value;
  }
  /**
   * Returns the color of the ambient occlusion.
   *
   * @deprecated Use color instead.
   * @return {Color} The color.
   */
  getColor() {
    return this.color;
  }
  /**
   * Sets the color of the ambient occlusion. Set to `null` to disable colorization.
   *
   * @deprecated Use color instead.
   * @param {Color} value - The color.
   */
  setColor(value) {
    this.color = value;
  }
  /**
   * Sets the occlusion distance cutoff.
   *
   * @deprecated Use ssaoMaterial instead.
   * @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setDistanceCutoff(threshold, falloff) {
    this.ssaoMaterial.distanceThreshold = threshold;
    this.ssaoMaterial.distanceFalloff = falloff;
  }
  /**
   * Sets the occlusion proximity cutoff.
   *
   * @deprecated Use ssaoMaterial instead.
   * @param {Number} threshold - The proximity threshold. Range [0.0, 1.0].
   * @param {Number} falloff - The falloff. Range [0.0, 1.0].
   */
  setProximityCutoff(threshold, falloff) {
    this.ssaoMaterial.proximityThreshold = threshold;
    this.ssaoMaterial.proximityFalloff = falloff;
  }
  /**
   * Sets the depth texture.
   *
   * @param {Texture} depthTexture - A depth texture.
   * @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
   */
  setDepthTexture(depthTexture, depthPacking = BasicDepthPacking18) {
    this.depthDownsamplingPass.setDepthTexture(depthTexture, depthPacking);
    this.ssaoMaterial.depthBuffer = depthTexture;
    this.ssaoMaterial.depthPacking = depthPacking;
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    const renderTarget = this.renderTarget;
    if (this.depthDownsamplingPass.enabled) {
      this.depthDownsamplingPass.render(renderer);
    }
    this.ssaoPass.render(renderer, null, renderTarget);
  }
  /**
   * Sets the size.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    const w = resolution.width, h = resolution.height;
    this.ssaoMaterial.copyCameraSettings(this.camera);
    this.ssaoMaterial.setSize(w, h);
    this.renderTarget.setSize(w, h);
    this.depthDownsamplingPass.resolution.scale = resolution.scale;
    this.depthDownsamplingPass.setSize(width, height);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    try {
      let normalDepthBuffer = this.uniforms.get("normalDepthBuffer").value;
      if (normalDepthBuffer === null) {
        this.depthDownsamplingPass.initialize(renderer, alpha, frameBufferType);
        normalDepthBuffer = this.depthDownsamplingPass.texture;
        this.uniforms.get("normalDepthBuffer").value = normalDepthBuffer;
        this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
        this.defines.set("NORMAL_DEPTH", "1");
      }
    } catch (e) {
      this.depthDownsamplingPass.enabled = false;
    }
  }
};

// src/effects/TextureEffect.js
import { Uniform as Uniform47, UnsignedByteType as UnsignedByteType16 } from "three";

// src/effects/glsl/texture.frag
var texture_default = "#ifdef TEXTURE_PRECISION_HIGH\nuniform mediump sampler2D map;\n#else\nuniform lowp sampler2D map;\n#endif\nvarying vec2 vUv2;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){\n#ifdef UV_TRANSFORM\nvec4 texel=texture2D(map,vUv2);\n#else\nvec4 texel=texture2D(map,uv);\n#endif\noutputColor=TEXEL;}";

// src/effects/glsl/texture.vert
var texture_default2 = "#ifdef ASPECT_CORRECTION\nuniform float scale;\n#else\nuniform mat3 uvTransform;\n#endif\nvarying vec2 vUv2;void mainSupport(const in vec2 uv){\n#ifdef ASPECT_CORRECTION\nvUv2=uv*vec2(aspect,1.0)*scale;\n#else\nvUv2=(uvTransform*vec3(uv,1.0)).xy;\n#endif\n}";

// src/effects/TextureEffect.js
var TextureEffect = class extends Effect {
  /**
   * Constructs a new texture effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Texture} [options.texture] - A texture.
   * @param {Boolean} [options.aspectCorrection=false] - Deprecated. Adjust the texture's offset, repeat and center instead.
   */
  constructor({ blendFunction, texture = null, aspectCorrection = false } = {}) {
    super("TextureEffect", texture_default, {
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["TEXEL", "texel"]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["map", new Uniform47(null)],
        ["scale", new Uniform47(1)],
        ["uvTransform", new Uniform47(null)]
      ])
    });
    this.texture = texture;
    this.aspectCorrection = aspectCorrection;
  }
  /**
   * The texture.
   *
   * @type {Texture}
   */
  get texture() {
    return this.uniforms.get("map").value;
  }
  set texture(value) {
    const prevTexture = this.texture;
    const uniforms = this.uniforms;
    const defines = this.defines;
    if (prevTexture !== value) {
      uniforms.get("map").value = value;
      uniforms.get("uvTransform").value = value.matrix;
      defines.delete("TEXTURE_PRECISION_HIGH");
      if (value !== null) {
        if (value.matrixAutoUpdate) {
          defines.set("UV_TRANSFORM", "1");
          this.setVertexShader(texture_default2);
        } else {
          defines.delete("UV_TRANSFORM");
          this.setVertexShader(null);
        }
        if (value.type !== UnsignedByteType16) {
          defines.set("TEXTURE_PRECISION_HIGH", "1");
        }
        if (prevTexture === null || prevTexture.type !== value.type || prevTexture.encoding !== value.encoding) {
          this.setChanged();
        }
      }
    }
  }
  /**
   * Returns the texture.
   *
   * @deprecated Use texture instead.
   * @return {Texture} The texture.
   */
  getTexture() {
    return this.texture;
  }
  /**
   * Sets the texture.
   *
   * @deprecated Use texture instead.
   * @param {Texture} value - The texture.
   */
  setTexture(value) {
    this.texture = value;
  }
  /**
   * Indicates whether aspect correction is enabled.
   *
   * @type {Number}
   * @deprecated Adjust the texture's offset, repeat, rotation and center instead.
   */
  get aspectCorrection() {
    return this.defines.has("ASPECT_CORRECTION");
  }
  set aspectCorrection(value) {
    if (this.aspectCorrection !== value) {
      if (value) {
        this.defines.set("ASPECT_CORRECTION", "1");
      } else {
        this.defines.delete("ASPECT_CORRECTION");
      }
      this.setChanged();
    }
  }
  /**
   * Indicates whether the texture UV coordinates will be transformed using the transformation matrix of the texture.
   *
   * @type {Boolean}
   * @deprecated Use texture.matrixAutoUpdate instead.
   */
  get uvTransform() {
    const texture = this.texture;
    return texture !== null && texture.matrixAutoUpdate;
  }
  set uvTransform(value) {
    const texture = this.texture;
    if (texture !== null) {
      texture.matrixAutoUpdate = value;
    }
  }
  /**
   * Sets the swizzles that will be applied to the components of a texel before it is written to the output color.
   *
   * @param {ColorChannel} r - The swizzle for the `r` component.
   * @param {ColorChannel} [g=r] - The swizzle for the `g` component.
   * @param {ColorChannel} [b=r] - The swizzle for the `b` component.
   * @param {ColorChannel} [a=r] - The swizzle for the `a` component.
   */
  setTextureSwizzleRGBA(r, g = r, b = r, a = r) {
    const rgba = "rgba";
    let swizzle = "";
    if (r !== ColorChannel.RED || g !== ColorChannel.GREEN || b !== ColorChannel.BLUE || a !== ColorChannel.ALPHA) {
      swizzle = [".", rgba[r], rgba[g], rgba[b], rgba[a]].join("");
    }
    this.defines.set("TEXEL", "texel" + swizzle);
    this.setChanged();
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    if (this.texture.matrixAutoUpdate) {
      this.texture.updateMatrix();
    }
  }
};

// src/effects/TiltShiftEffect.js
import { Uniform as Uniform48, Vector2 as Vector227, WebGLRenderTarget as WebGLRenderTarget22 } from "three";

// src/effects/glsl/tilt-shift.frag
var tilt_shift_default = "#ifdef FRAMEBUFFER_PRECISION_HIGH\nuniform mediump sampler2D map;\n#else\nuniform lowp sampler2D map;\n#endif\nuniform vec2 maskParams;varying vec2 vUv2;float linearGradientMask(const in float x){return step(maskParams.x,x)-step(maskParams.y,x);}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){float mask=linearGradientMask(vUv2.y);vec4 texel=texture2D(map,uv);outputColor=mix(texel,inputColor,mask);}";

// src/effects/glsl/tilt-shift.vert
var tilt_shift_default2 = "uniform vec2 rotation;varying vec2 vUv2;void mainSupport(const in vec2 uv){vUv2=(uv-0.5)*2.0*vec2(aspect,1.0);vUv2=vec2(dot(rotation,vUv2),dot(rotation,vec2(vUv2.y,-vUv2.x)));}";

// src/effects/TiltShiftEffect.js
var TiltShiftEffect = class extends Effect {
  /**
   * Constructs a new tilt shift Effect
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {Number} [options.offset=0.0] - The relative offset of the focus area.
   * @param {Number} [options.rotation=0.0] - The rotation of the focus area in radians.
   * @param {Number} [options.focusArea=0.4] - The relative size of the focus area.
   * @param {Number} [options.feather=0.3] - The softness of the focus area edges.
   * @param {Number} [options.bias=0.06] - Deprecated.
   * @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
   * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
   * @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
   * @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
   */
  constructor({
    blendFunction,
    offset = 0,
    rotation = 0,
    focusArea = 0.4,
    feather = 0.3,
    kernelSize = KernelSize.MEDIUM,
    resolutionScale = 0.5,
    resolutionX = Resolution.AUTO_SIZE,
    resolutionY = Resolution.AUTO_SIZE
  } = {}) {
    super("TiltShiftEffect", tilt_shift_default, {
      vertexShader: tilt_shift_default2,
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["rotation", new Uniform48(new Vector227())],
        ["maskParams", new Uniform48(new Vector227())],
        ["map", new Uniform48(null)]
      ])
    });
    this._offset = offset;
    this._focusArea = focusArea;
    this._feather = feather;
    this.renderTarget = new WebGLRenderTarget22(1, 1, { depthBuffer: false });
    this.renderTarget.texture.name = "TiltShift.Target";
    this.uniforms.get("map").value = this.renderTarget.texture;
    this.blurPass = new TiltShiftBlurPass({
      kernelSize,
      resolutionScale,
      resolutionX,
      resolutionY,
      offset,
      rotation,
      focusArea,
      feather
    });
    const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
    resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
    this.rotation = rotation;
    this.updateParams();
  }
  /**
   * Updates the mask params.
   *
   * @private
   */
  updateParams() {
    const params = this.uniforms.get("maskParams").value;
    const x = Math.max(this.focusArea - this.feather, 0);
    params.set(this.offset - x, this.offset + x);
  }
  /**
   * The rotation of the focus area in radians.
   *
   * @type {Number}
   */
  get rotation() {
    return Math.acos(this.uniforms.get("rotation").value.x);
  }
  set rotation(value) {
    this.uniforms.get("rotation").value.set(Math.cos(value), Math.sin(value));
    this.blurPass.blurMaterial.rotation = value;
  }
  /**
   * The relative offset of the focus area.
   *
   * @type {Number}
   */
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = value;
    this.blurPass.blurMaterial.offset = value;
    this.updateParams();
  }
  /**
   * The relative size of the focus area.
   *
   * @type {Number}
   */
  get focusArea() {
    return this._focusArea;
  }
  set focusArea(value) {
    this._focusArea = value;
    this.blurPass.blurMaterial.focusArea = value;
    this.updateParams();
  }
  /**
   * The softness of the focus area edges.
   *
   * @type {Number}
   */
  get feather() {
    return this._feather;
  }
  set feather(value) {
    this._feather = value;
    this.blurPass.blurMaterial.feather = value;
    this.updateParams();
  }
  /**
   * A blend bias.
   *
   * @type {Number}
   * @deprecated
   */
  get bias() {
    return 0;
  }
  set bias(value) {
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    this.blurPass.render(renderer, inputBuffer, this.renderTarget);
  }
  /**
   * Updates the size of internal render targets.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */
  setSize(width, height) {
    const resolution = this.resolution;
    resolution.setBaseSize(width, height);
    this.renderTarget.setSize(resolution.width, resolution.height);
    this.blurPass.resolution.copy(resolution);
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.blurPass.initialize(renderer, alpha, frameBufferType);
    if (frameBufferType !== void 0) {
      this.renderTarget.texture.type = frameBufferType;
      if (getOutputColorSpace(renderer) === SRGBColorSpace) {
        setTextureColorSpace(this.renderTarget.texture, SRGBColorSpace);
      }
    }
  }
};

// src/effects/ToneMappingEffect.js
import { LinearMipmapLinearFilter, Uniform as Uniform49, WebGLRenderTarget as WebGLRenderTarget23 } from "three";

// src/effects/glsl/tone-mapping.frag
var tone_mapping_default = "#include <tonemapping_pars_fragment>\n#if THREE_REVISION < 143\n#define luminance(v) linearToRelativeLuminance(v)\n#endif\nuniform float whitePoint;\n#if TONE_MAPPING_MODE == 1 || TONE_MAPPING_MODE == 2\nuniform float middleGrey;\n#if TONE_MAPPING_MODE == 2\nuniform lowp sampler2D luminanceBuffer;\n#else\nuniform float averageLuminance;\n#endif\nvec3 Reinhard2ToneMapping(vec3 color){color*=toneMappingExposure;float l=luminance(color);\n#if TONE_MAPPING_MODE == 2\nfloat lumAvg=unpackRGBAToFloat(texture2D(luminanceBuffer,vec2(0.5)));\n#else\nfloat lumAvg=averageLuminance;\n#endif\nfloat lumScaled=(l*middleGrey)/max(lumAvg,1e-6);float lumCompressed=lumScaled*(1.0+lumScaled/(whitePoint*whitePoint));lumCompressed/=(1.0+lumScaled);return clamp(lumCompressed*color,0.0,1.0);}\n#elif TONE_MAPPING_MODE == 3\n#define A 0.15\n#define B 0.50\n#define C 0.10\n#define D 0.20\n#define E 0.02\n#define F 0.30\nvec3 Uncharted2Helper(const in vec3 x){return((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;}vec3 Uncharted2ToneMapping(vec3 color){color*=toneMappingExposure;return clamp(Uncharted2Helper(color)/Uncharted2Helper(vec3(whitePoint)),0.0,1.0);}\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){\n#if TONE_MAPPING_MODE == 1 || TONE_MAPPING_MODE == 2\noutputColor=vec4(Reinhard2ToneMapping(inputColor.rgb),inputColor.a);\n#elif TONE_MAPPING_MODE == 3\noutputColor=vec4(Uncharted2ToneMapping(inputColor.rgb),inputColor.a);\n#else\noutputColor=vec4(toneMapping(inputColor.rgb),inputColor.a);\n#endif\n}";

// src/effects/ToneMappingEffect.js
var ToneMappingEffect = class extends Effect {
  /**
   * Constructs a new tone mapping effect.
   *
   * The additional parameters only affect the Reinhard2 operator.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.SRC] - The blend function of this effect.
   * @param {Boolean} [options.adaptive=false] - Deprecated. Use mode instead.
   * @param {ToneMappingMode} [options.mode=ToneMappingMode.AGX] - The tone mapping mode.
   * @param {Number} [options.resolution=256] - The resolution of the luminance texture. Must be a power of two.
   * @param {Number} [options.maxLuminance=4.0] - Deprecated. Same as whitePoint.
   * @param {Number} [options.whitePoint=4.0] - The white point.
   * @param {Number} [options.middleGrey=0.6] - The middle grey factor.
   * @param {Number} [options.minLuminance=0.01] - The minimum luminance. Prevents very high exposure in dark scenes.
   * @param {Number} [options.averageLuminance=1.0] - The average luminance. Used for the non-adaptive Reinhard operator.
   * @param {Number} [options.adaptationRate=1.0] - The luminance adaptation rate.
   */
  constructor({
    blendFunction = BlendFunction.SRC,
    adaptive = false,
    mode = adaptive ? ToneMappingMode.REINHARD2_ADAPTIVE : ToneMappingMode.AGX,
    resolution = 256,
    maxLuminance = 4,
    whitePoint = maxLuminance,
    middleGrey = 0.6,
    minLuminance = 0.01,
    averageLuminance = 1,
    adaptationRate = 1
  } = {}) {
    super("ToneMappingEffect", tone_mapping_default, {
      blendFunction,
      uniforms: /* @__PURE__ */ new Map([
        ["luminanceBuffer", new Uniform49(null)],
        ["maxLuminance", new Uniform49(maxLuminance)],
        // Unused
        ["whitePoint", new Uniform49(whitePoint)],
        ["middleGrey", new Uniform49(middleGrey)],
        ["averageLuminance", new Uniform49(averageLuminance)]
      ])
    });
    this.renderTargetLuminance = new WebGLRenderTarget23(1, 1, {
      minFilter: LinearMipmapLinearFilter,
      depthBuffer: false
    });
    this.renderTargetLuminance.texture.generateMipmaps = true;
    this.renderTargetLuminance.texture.name = "Luminance";
    this.luminancePass = new LuminancePass({
      renderTarget: this.renderTargetLuminance
    });
    this.adaptiveLuminancePass = new AdaptiveLuminancePass(this.luminancePass.texture, {
      minLuminance,
      adaptationRate
    });
    this.uniforms.get("luminanceBuffer").value = this.adaptiveLuminancePass.texture;
    this.resolution = resolution;
    this.mode = mode;
  }
  /**
   * The tone mapping mode.
   *
   * @type {ToneMappingMode}
   */
  get mode() {
    return Number(this.defines.get("TONE_MAPPING_MODE"));
  }
  set mode(value) {
    if (this.mode !== value) {
      this.defines.clear();
      this.defines.set("TONE_MAPPING_MODE", value.toFixed(0));
      value = validateToneMappingMode(value);
      switch (value) {
        case ToneMappingMode.REINHARD:
          this.defines.set("toneMapping(texel)", "ReinhardToneMapping(texel)");
          break;
        case ToneMappingMode.OPTIMIZED_CINEON:
          this.defines.set("toneMapping(texel)", "OptimizedCineonToneMapping(texel)");
          break;
        case ToneMappingMode.ACES_FILMIC:
          this.defines.set("toneMapping(texel)", "ACESFilmicToneMapping(texel)");
          break;
        case ToneMappingMode.AGX:
          this.defines.set("toneMapping(texel)", "AgXToneMapping(texel)");
          break;
        default:
          this.defines.set("toneMapping(texel)", "texel");
          break;
      }
      this.adaptiveLuminancePass.enabled = value === ToneMappingMode.REINHARD2_ADAPTIVE;
      this.setChanged();
    }
  }
  /**
   * Returns the current tone mapping mode.
   *
   * @deprecated Use mode instead.
   * @return {ToneMappingMode} The tone mapping mode.
   */
  getMode() {
    return this.mode;
  }
  /**
   * Sets the tone mapping mode.
   *
   * @deprecated Use mode instead.
   * @param {ToneMappingMode} value - The tone mapping mode.
   */
  setMode(value) {
    this.mode = value;
  }
  /**
   * The white point. Default is `4.0`.
   *
   * Only applies to Reinhard2 (Modified & Adaptive).
   *
   * @type {Number}
   */
  get whitePoint() {
    return this.uniforms.get("whitePoint").value;
  }
  set whitePoint(value) {
    this.uniforms.get("whitePoint").value = value;
  }
  /**
   * The middle grey factor. Default is `0.6`.
   *
   * Only applies to Reinhard2 (Modified & Adaptive).
   *
   * @type {Number}
   */
  get middleGrey() {
    return this.uniforms.get("middleGrey").value;
  }
  set middleGrey(value) {
    this.uniforms.get("middleGrey").value = value;
  }
  /**
   * The average luminance.
   *
   * Only applies to Reinhard2 (Modified).
   *
   * @type {Number}
   */
  get averageLuminance() {
    return this.uniforms.get("averageLuminance").value;
  }
  set averageLuminance(value) {
    this.uniforms.get("averageLuminance").value = value;
  }
  /**
   * The adaptive luminance material.
   *
   * @type {AdaptiveLuminanceMaterial}
   */
  get adaptiveLuminanceMaterial() {
    return this.adaptiveLuminancePass.fullscreenMaterial;
  }
  /**
   * Returns the adaptive luminance material.
   *
   * @deprecated Use adaptiveLuminanceMaterial instead.
   * @return {AdaptiveLuminanceMaterial} The material.
   */
  getAdaptiveLuminanceMaterial() {
    return this.adaptiveLuminanceMaterial;
  }
  /**
   * The resolution of the luminance texture. Must be a power of two.
   *
   * @type {Number}
   */
  get resolution() {
    return this.luminancePass.resolution.width;
  }
  set resolution(value) {
    const exponent = Math.max(0, Math.ceil(Math.log2(value)));
    const size = Math.pow(2, exponent);
    this.luminancePass.resolution.setPreferredSize(size, size);
    this.adaptiveLuminanceMaterial.mipLevel1x1 = exponent;
  }
  /**
   * Returns the resolution of the luminance texture.
   *
   * @deprecated Use resolution instead.
   * @return {Number} The resolution.
   */
  getResolution() {
    return this.resolution;
  }
  /**
   * Sets the resolution of the luminance texture. Must be a power of two.
   *
   * @deprecated Use resolution instead.
   * @param {Number} value - The resolution.
   */
  setResolution(value) {
    this.resolution = value;
  }
  /**
   * Indicates whether this pass uses adaptive luminance.
   *
   * @type {Boolean}
   * @deprecated Use mode instead.
   */
  get adaptive() {
    return this.mode === ToneMappingMode.REINHARD2_ADAPTIVE;
  }
  set adaptive(value) {
    this.mode = value ? ToneMappingMode.REINHARD2_ADAPTIVE : ToneMappingMode.REINHARD2;
  }
  /**
   * The luminance adaptation rate.
   *
   * @type {Number}
   * @deprecated Use adaptiveLuminanceMaterial.adaptationRate instead.
   */
  get adaptationRate() {
    return this.adaptiveLuminanceMaterial.adaptationRate;
  }
  set adaptationRate(value) {
    this.adaptiveLuminanceMaterial.adaptationRate = value;
  }
  /**
   * @type {Number}
   * @deprecated
   */
  get distinction() {
    console.warn(this.name, "distinction was removed.");
    return 1;
  }
  set distinction(value) {
    console.warn(this.name, "distinction was removed.");
  }
  /**
   * Updates this effect.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   */
  update(renderer, inputBuffer, deltaTime) {
    if (this.adaptiveLuminancePass.enabled) {
      this.luminancePass.render(renderer, inputBuffer);
      this.adaptiveLuminancePass.render(renderer, null, null, deltaTime);
    }
  }
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */
  initialize(renderer, alpha, frameBufferType) {
    this.adaptiveLuminancePass.initialize(renderer, alpha, frameBufferType);
  }
};

// src/effects/VignetteEffect.js
import { Uniform as Uniform50 } from "three";

// src/effects/glsl/vignette.frag
var vignette_default = "uniform float offset;uniform float darkness;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){const vec2 center=vec2(0.5);vec3 color=inputColor.rgb;\n#if VIGNETTE_TECHNIQUE == 0\nfloat d=distance(uv,center);color*=smoothstep(0.8,offset*0.799,d*(darkness+offset));\n#else\nvec2 coord=(uv-center)*vec2(offset);color=mix(color,vec3(1.0-darkness),dot(coord,coord));\n#endif\noutputColor=vec4(color,inputColor.a);}";

// src/effects/VignetteEffect.js
var VignetteEffect = class extends Effect {
  /**
   * Constructs a new Vignette effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
   * @param {VignetteTechnique} [options.technique=VignetteTechnique.DEFAULT] - The Vignette technique.
   * @param {Boolean} [options.eskil=false] - Deprecated. Use technique instead.
   * @param {Number} [options.offset=0.5] - The Vignette offset.
   * @param {Number} [options.darkness=0.5] - The Vignette darkness.
   */
  constructor({
    blendFunction,
    technique = VignetteTechnique.DEFAULT,
    eskil = false,
    offset = 0.5,
    darkness = 0.5
  } = {}) {
    super("VignetteEffect", vignette_default, {
      blendFunction,
      defines: /* @__PURE__ */ new Map([
        ["VIGNETTE_TECHNIQUE", technique.toFixed(0)]
      ]),
      uniforms: /* @__PURE__ */ new Map([
        ["offset", new Uniform50(offset)],
        ["darkness", new Uniform50(darkness)]
      ])
    });
  }
  /**
   * The Vignette technique.
   *
   * @type {VignetteTechnique}
   */
  get technique() {
    return Number(this.defines.get("VIGNETTE_TECHNIQUE"));
  }
  set technique(value) {
    if (this.technique !== value) {
      this.defines.set("VIGNETTE_TECHNIQUE", value.toFixed(0));
      this.setChanged();
    }
  }
  /**
   * Indicates whether Eskil's Vignette technique is enabled.
   *
   * @type {Boolean}
   * @deprecated Use technique instead.
   */
  get eskil() {
    return this.technique === VignetteTechnique.ESKIL;
  }
  /**
   * Indicates whether Eskil's Vignette technique is enabled.
   *
   * @type {Boolean}
   * @deprecated Use technique instead.
   */
  set eskil(value) {
    this.technique = value ? VignetteTechnique.ESKIL : VignetteTechnique.DEFAULT;
  }
  /**
   * Returns the Vignette technique.
   *
   * @deprecated Use technique instead.
   * @return {VignetteTechnique} The technique.
   */
  getTechnique() {
    return this.technique;
  }
  /**
   * Sets the Vignette technique.
   *
   * @deprecated Use technique instead.
   * @param {VignetteTechnique} value - The technique.
   */
  setTechnique(value) {
    this.technique = value;
  }
  /**
   * The Vignette offset.
   *
   * @type {Number}
   */
  get offset() {
    return this.uniforms.get("offset").value;
  }
  set offset(value) {
    this.uniforms.get("offset").value = value;
  }
  /**
   * Returns the Vignette offset.
   *
   * @deprecated Use offset instead.
   * @return {Number} The offset.
   */
  getOffset() {
    return this.offset;
  }
  /**
   * Sets the Vignette offset.
   *
   * @deprecated Use offset instead.
   * @param {Number} value - The offset.
   */
  setOffset(value) {
    this.offset = value;
  }
  /**
   * The Vignette darkness.
   *
   * @type {Number}
   */
  get darkness() {
    return this.uniforms.get("darkness").value;
  }
  set darkness(value) {
    this.uniforms.get("darkness").value = value;
  }
  /**
   * Returns the Vignette darkness.
   *
   * @deprecated Use darkness instead.
   * @return {Number} The darkness.
   */
  getDarkness() {
    return this.darkness;
  }
  /**
   * Sets the Vignette darkness.
   *
   * @deprecated Use darkness instead.
   * @param {Number} value - The darkness.
   */
  setDarkness(value) {
    this.darkness = value;
  }
};

// src/loaders/LUT3dlLoader.js
import { FileLoader, Loader, LoadingManager as LoadingManager3 } from "three";
var LUT3dlLoader = class extends Loader {
  /**
   * Loads a LUT.
   *
   * @param {String} url - The URL of the 3dl-file.
   * @param {Function} [onLoad] - A callback that receives the loaded lookup texture.
   * @param {Function} [onProgress] - A progress callback that receives the XMLHttpRequest instance.
   * @param {Function} [onError] - An error callback that receives the URL of the file that failed to load.
   * @return {Promise<LookupTexture>} A promise that returns the lookup texture.
   */
  load(url, onLoad = () => {
  }, onProgress = () => {
  }, onError = null) {
    const externalManager = this.manager;
    const internalManager = new LoadingManager3();
    const loader = new FileLoader(internalManager);
    loader.setPath(this.path);
    loader.setResponseType("text");
    return new Promise((resolve, reject) => {
      internalManager.onError = (url2) => {
        externalManager.itemError(url2);
        if (onError !== null) {
          onError(`Failed to load ${url2}`);
          resolve();
        } else {
          reject(`Failed to load ${url2}`);
        }
      };
      externalManager.itemStart(url);
      loader.load(url, (data) => {
        try {
          const result = this.parse(data);
          externalManager.itemEnd(url);
          onLoad(result);
          resolve(result);
        } catch (e) {
          console.error(e);
          internalManager.onError(url);
        }
      }, onProgress);
    });
  }
  /**
   * Parses the given data.
   *
   * @param {String} input - The LUT data.
   * @return {LookupTexture} The lookup texture.
   * @throws {Error} Fails if the data is invalid.
   */
  parse(input) {
    const regExpGridInfo = /^[\d ]+$/m;
    const regExpDataPoints = /^([\d.e+-]+) +([\d.e+-]+) +([\d.e+-]+) *$/gm;
    let result = regExpGridInfo.exec(input);
    if (result === null) {
      throw new Error("Missing grid information");
    }
    const gridLines = result[0].trim().split(/\s+/g).map((n) => Number(n));
    const gridStep = gridLines[1] - gridLines[0];
    const size = gridLines.length;
    const sizeSq = size ** 2;
    for (let i = 1, l = gridLines.length; i < l; ++i) {
      if (gridStep !== gridLines[i] - gridLines[i - 1]) {
        throw new Error("Inconsistent grid size");
      }
    }
    const data = new Float32Array(size ** 3 * 4);
    let maxValue = 0;
    let index = 0;
    while ((result = regExpDataPoints.exec(input)) !== null) {
      const r = Number(result[1]);
      const g = Number(result[2]);
      const b = Number(result[3]);
      maxValue = Math.max(maxValue, r, g, b);
      const bLayer = index % size;
      const gLayer = Math.floor(index / size) % size;
      const rLayer = Math.floor(index / sizeSq) % size;
      const d4 = (bLayer * sizeSq + gLayer * size + rLayer) * 4;
      data[d4 + 0] = r;
      data[d4 + 1] = g;
      data[d4 + 2] = b;
      data[d4 + 3] = 1;
      ++index;
    }
    const bits = Math.ceil(Math.log2(maxValue));
    const maxBitValue = Math.pow(2, bits);
    for (let i = 0, l = data.length; i < l; i += 4) {
      data[i + 0] /= maxBitValue;
      data[i + 1] /= maxBitValue;
      data[i + 2] /= maxBitValue;
    }
    return new LookupTexture(data, size);
  }
};

// src/loaders/LUTCubeLoader.js
import { FileLoader as FileLoader2, Loader as Loader2, LoadingManager as LoadingManager4, Vector3 as Vector37 } from "three";
var LUTCubeLoader = class extends Loader2 {
  /**
   * Loads a LUT.
   *
   * @param {String} url - The URL of the CUBE-file.
   * @param {Function} [onLoad] - A callback that receives the loaded lookup texture.
   * @param {Function} [onProgress] - A progress callback that receives the XMLHttpRequest instance.
   * @param {Function} [onError] - An error callback that receives the URL of the file that failed to load.
   * @return {Promise<LookupTexture>} A promise that returns the lookup texture.
   */
  load(url, onLoad = () => {
  }, onProgress = () => {
  }, onError = null) {
    const externalManager = this.manager;
    const internalManager = new LoadingManager4();
    const loader = new FileLoader2(internalManager);
    loader.setPath(this.path);
    loader.setResponseType("text");
    return new Promise((resolve, reject) => {
      internalManager.onError = (url2) => {
        externalManager.itemError(url2);
        if (onError !== null) {
          onError(`Failed to load ${url2}`);
          resolve();
        } else {
          reject(`Failed to load ${url2}`);
        }
      };
      externalManager.itemStart(url);
      loader.load(url, (data) => {
        try {
          const result = this.parse(data);
          externalManager.itemEnd(url);
          onLoad(result);
          resolve(result);
        } catch (e) {
          console.error(e);
          internalManager.onError(url);
        }
      }, onProgress);
    });
  }
  /**
   * Parses the given data.
   *
   * @param {String} input - The LUT data.
   * @return {LookupTexture} The lookup texture.
   * @throws {Error} Fails if the data is invalid.
   */
  parse(input) {
    const regExpTitle = /TITLE +"([^"]*)"/;
    const regExpSize = /LUT_3D_SIZE +(\d+)/;
    const regExpDomainMin = /DOMAIN_MIN +([\d.]+) +([\d.]+) +([\d.]+)/;
    const regExpDomainMax = /DOMAIN_MAX +([\d.]+) +([\d.]+) +([\d.]+)/;
    const regExpDataPoints = /^([\d.e+-]+) +([\d.e+-]+) +([\d.e+-]+) *$/gm;
    let result = regExpTitle.exec(input);
    const title = result !== null ? result[1] : null;
    result = regExpSize.exec(input);
    if (result === null) {
      throw new Error("Missing LUT_3D_SIZE information");
    }
    const size = Number(result[1]);
    const data = new Float32Array(size ** 3 * 4);
    const domainMin = new Vector37(0, 0, 0);
    const domainMax = new Vector37(1, 1, 1);
    result = regExpDomainMin.exec(input);
    if (result !== null) {
      domainMin.set(Number(result[1]), Number(result[2]), Number(result[3]));
    }
    result = regExpDomainMax.exec(input);
    if (result !== null) {
      domainMax.set(Number(result[1]), Number(result[2]), Number(result[3]));
    }
    if (domainMin.x > domainMax.x || domainMin.y > domainMax.y || domainMin.z > domainMax.z) {
      domainMin.set(0, 0, 0);
      domainMax.set(1, 1, 1);
      throw new Error("Invalid input domain");
    }
    let i = 0;
    while ((result = regExpDataPoints.exec(input)) !== null) {
      data[i++] = Number(result[1]);
      data[i++] = Number(result[2]);
      data[i++] = Number(result[3]);
      data[i++] = 1;
    }
    const lut = new LookupTexture(data, size);
    lut.domainMin.copy(domainMin);
    lut.domainMax.copy(domainMax);
    if (title !== null) {
      lut.name = title;
    }
    return lut;
  }
};

// src/loaders/SMAAImageLoader.js
import { Loader as Loader3, LoadingManager as LoadingManager5 } from "three";
var SMAAImageLoader = class extends Loader3 {
  /**
   * Loads the SMAA data images.
   *
   * @param {Function} [onLoad] - A callback that receives the search image and area image as a pair.
   * @param {Function} [onError] - An error callback that receives the URL of the image that failed to load.
   * @return {Promise<Image[]>} A promise that returns the search image and area image as a pair.
   */
  load(onLoad = () => {
  }, onError = null) {
    if (arguments.length === 4) {
      onLoad = arguments[1];
      onError = arguments[3];
    } else if (arguments.length === 3 || typeof arguments[0] !== "function") {
      onLoad = arguments[1];
      onError = null;
    }
    const externalManager = this.manager;
    const internalManager = new LoadingManager5();
    return new Promise((resolve, reject) => {
      const searchImage = new Image();
      const areaImage = new Image();
      internalManager.onError = (url) => {
        externalManager.itemError(url);
        if (onError !== null) {
          onError(`Failed to load ${url}`);
          resolve();
        } else {
          reject(`Failed to load ${url}`);
        }
      };
      internalManager.onLoad = () => {
        const result = [searchImage, areaImage];
        onLoad(result);
        resolve(result);
      };
      searchImage.addEventListener("error", (e) => {
        internalManager.itemError("smaa-search");
      });
      areaImage.addEventListener("error", (e) => {
        internalManager.itemError("smaa-area");
      });
      searchImage.addEventListener("load", () => {
        externalManager.itemEnd("smaa-search");
        internalManager.itemEnd("smaa-search");
      });
      areaImage.addEventListener("load", () => {
        externalManager.itemEnd("smaa-area");
        internalManager.itemEnd("smaa-area");
      });
      externalManager.itemStart("smaa-search");
      externalManager.itemStart("smaa-area");
      internalManager.itemStart("smaa-search");
      internalManager.itemStart("smaa-area");
      searchImage.src = searchImageDataURL_default;
      areaImage.src = areaImageDataURL_default;
    });
  }
};
export {
  AdaptiveLuminanceMaterial,
  AdaptiveLuminancePass,
  BlendFunction,
  BlendMode,
  BloomEffect,
  KawaseBlurPass as BlurPass,
  BokehEffect,
  BokehMaterial,
  BoxBlurMaterial,
  BoxBlurPass,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  CircleOfConfusionMaterial,
  ClearMaskPass,
  ClearPass,
  ColorAverageEffect,
  ColorChannel,
  ColorDepthEffect,
  EdgeDetectionMaterial as ColorEdgesMaterial,
  KawaseBlurMaterial as ConvolutionMaterial,
  CopyMaterial,
  CopyPass,
  DepthComparisonMaterial,
  DepthCopyMaterial,
  DepthCopyMode,
  DepthCopyPass,
  DepthDownsamplingMaterial,
  DepthDownsamplingPass,
  DepthEffect,
  DepthMaskMaterial,
  DepthOfFieldEffect,
  DepthPass,
  DepthPickingPass,
  DepthCopyPass as DepthSavePass,
  DepthTestStrategy,
  DisplayP3ColorSpace,
  Disposable,
  DotScreenEffect,
  DownsamplingMaterial,
  EdgeDetectionMaterial,
  EdgeDetectionMode,
  Effect,
  EffectAttribute,
  EffectComposer,
  EffectMaterial,
  EffectPass,
  EffectShaderData,
  EffectShaderSection,
  FXAAEffect,
  GammaCorrectionEffect,
  GaussKernel,
  GaussianBlurMaterial,
  GaussianBlurPass,
  GlitchEffect,
  GlitchMode,
  GodRaysEffect,
  GodRaysMaterial,
  GridEffect,
  HueSaturationEffect,
  ImmutableTimer,
  Initializable,
  KawaseBlurMaterial,
  KawaseBlurPass,
  KernelSize,
  LUT1DEffect,
  LUT3DEffect,
  LUT3dlLoader,
  LUTCubeLoader,
  LUT3DEffect as LUTEffect,
  LUTOperation,
  LambdaPass,
  LensDistortionEffect,
  LinearSRGBColorSpace,
  LookupTexture,
  LookupTexture as LookupTexture3D,
  LuminanceMaterial,
  LuminancePass,
  MaskFunction,
  MaskMaterial,
  MaskPass,
  MipmapBlurPass,
  NoColorSpace,
  NoiseEffect,
  NoiseTexture,
  NormalPass,
  OutlineMaterial as OutlineEdgesMaterial,
  OutlineEffect,
  OutlineMaterial,
  OverrideMaterialManager,
  Pass,
  PixelationEffect,
  PredicationMode,
  RawImageData,
  RealisticBokehEffect,
  RenderPass,
  Resizable,
  Resolution as Resizer,
  Resolution,
  SMAAAreaImageData,
  SMAAEffect,
  SMAAImageGenerator,
  SMAAImageLoader,
  SMAAPreset,
  SMAASearchImageData,
  SMAAWeightsMaterial,
  SRGBColorSpace,
  SSAOEffect,
  SSAOMaterial,
  CopyPass as SavePass,
  ScanlineEffect,
  EffectShaderSection as Section,
  Selection,
  SelectiveBloomEffect,
  SepiaEffect,
  ShaderPass,
  ShockWaveEffect,
  TetrahedralUpscaler,
  TextureEffect,
  TiltShiftBlurMaterial,
  TiltShiftBlurPass,
  TiltShiftEffect,
  Timer,
  ToneMappingEffect,
  ToneMappingMode,
  UpsamplingMaterial,
  VignetteEffect,
  VignetteTechnique,
  WebGLExtension,
  version
};
