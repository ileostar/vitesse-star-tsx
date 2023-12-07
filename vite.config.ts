/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import PiniaAutoRefs from 'pinia-auto-refs'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueMacros from 'unplugin-vue-macros/vite'
import IconsResolver from 'unplugin-icons/resolver'
import VueDevtools from 'vite-plugin-vue-devtools'
import ViteRestart from 'vite-plugin-restart'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    },
    extensions: ['.js', '.json', '.ts', '.tsx', '.jsx']
  },
  plugins: [
    VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true
          }
        }),
        vueJsx: VueJsx()
      }
    }),
    ViteRestart({
      restart: ['vite.config.[jt]s']
    }),

    VueDevtools(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'pinia',
        'vue-router',
        '@vueuse/core',
        {
          alova: ['useRequest', 'useWatcher', 'useFetcher']
        },
        {
          '@/helper/pinia-auto-refs': ['useStore']
        }
      ],

      resolvers: [
        // Auto import UI components
        // 自动导入ElementPlus组件
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver()
      ],
      dts: true,
      dirs: ['./src/components', './src/store', './src/composables'],
      vueTemplate: false,
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),

    // https://github.com/Allen-1998/pinia-auto-refs
    PiniaAutoRefs(),
    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep']
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx$/]
    }),

    UnoCSS(),

    Pages({
      extensions: ['ts', 'js', 'tsx', 'jsx']
    })
  ],
  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom'
  }
})
