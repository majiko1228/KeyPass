<script setup>
import { computed, ref, watchEffect } from "vue";

const storedTheme = localStorage.getItem("keypass.theme") || "light";
const theme = ref(storedTheme);
const activeView = ref("vault");
const search = ref("");
const selectedId = ref("github");
const activeTag = ref("");
const showEditor = ref(false);
const showGenerator = ref(false);
const toast = ref("");
let toastTimer;

const entries = ref([
  { id: "github", name: "GitHub", account: "majiko1228", password: "G7!vR8p#xQ2mT9@k", site: "github.com", tags: ["开发", "工作"], note: "主要代码仓库和个人项目。", favorite: true, updated: "今天" },
  { id: "notion", name: "Notion", account: "chen@example.com", password: "T3#cW7!aL9rQ", site: "notion.so", tags: ["工作"], note: "团队文档与项目计划。", favorite: true, updated: "昨天" },
  { id: "icloud", name: "iCloud", account: "chen@example.com", password: "A8!xJ5#mU2pK", site: "icloud.com", tags: ["个人", "重要"], note: "已开启双重认证。", favorite: false, updated: "7 月 20 日" },
  { id: "bank", name: "网上银行", account: "chenyupeng", password: "S8#zT5!qM4rN2", site: "bank.example.com", tags: ["金融", "重要"], note: "登录时需要硬件令牌。", favorite: false, updated: "7 月 18 日" },
]);

const editor = ref(emptyEntry());
const generatedPassword = ref("");
const selected = computed(() => entries.value.find((entry) => entry.id === selectedId.value) || entries.value[0]);
const allTags = computed(() => [...new Set(entries.value.flatMap((entry) => entry.tags))]);
const visibleEntries = computed(() => entries.value.filter((entry) => {
  const keyword = search.value.trim().toLowerCase();
  const matchedView = activeView.value !== "favorites" || entry.favorite;
  const matchedTag = !activeTag.value || entry.tags.includes(activeTag.value);
  const matchedSearch = !keyword || [entry.name, entry.account, entry.site, entry.tags.join(" ")].join(" ").toLowerCase().includes(keyword);
  return matchedView && matchedTag && matchedSearch;
}));
const viewName = computed(() => activeView.value === "favorites" ? "我的收藏" : "全部账号");

watchEffect(() => {
  document.documentElement.dataset.theme = theme.value;
  localStorage.setItem("keypass.theme", theme.value);
});

function emptyEntry() {
  return { id: "", name: "", account: "", password: "", site: "", tags: "", note: "", favorite: false, updated: "刚刚" };
}

function setView(view) {
  activeView.value = view;
  activeTag.value = "";
}

function openEditor(entry = null) {
  editor.value = entry ? { ...entry, tags: entry.tags.join("、") } : emptyEntry();
  showEditor.value = true;
}

function saveEntry() {
  if (!editor.value.name.trim() || !editor.value.account.trim() || !editor.value.password.trim()) return;
  const record = {
    ...editor.value,
    id: editor.value.id || `entry-${Date.now()}`,
    tags: String(editor.value.tags).split(/[、,]/).map((tag) => tag.trim()).filter(Boolean),
    updated: "刚刚",
  };
  const index = entries.value.findIndex((entry) => entry.id === record.id);
  if (index >= 0) entries.value[index] = record;
  else entries.value.unshift(record);
  selectedId.value = record.id;
  showEditor.value = false;
  notify(index >= 0 ? "账号已更新" : "账号已添加");
}

function toggleFavorite() {
  selected.value.favorite = !selected.value.favorite;
  notify(selected.value.favorite ? "已加入收藏" : "已取消收藏");
}

async function copy(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    notify(`已复制${label}`);
  } catch {
    notify("当前浏览器不支持复制");
  }
}

function makePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  generatedPassword.value = Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function useGeneratedPassword() {
  editor.value.password = generatedPassword.value;
  showGenerator.value = false;
}

function notify(message) {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.value = ""; }, 1800);
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="./">
        <span class="brand-mark">K</span>
        <span><strong>KeyPass</strong><small>个人密码空间</small></span>
      </a>

      <nav class="navigation" aria-label="主导航">
        <p class="nav-caption">密码管理</p>
        <button class="nav-button" :class="{ active: activeView === 'vault' }" @click="setView('vault')"><span>▦</span>账号库</button>
        <div class="sub-navigation">
          <button :class="{ active: activeView === 'vault' }" @click="setView('vault')">全部账号</button>
          <button :class="{ active: activeView === 'favorites' }" @click="setView('favorites')">我的收藏</button>
        </div>
        <p class="nav-caption nav-caption-spaced">工作空间</p>
        <button class="nav-button"><span>◌</span>安全审查</button>
        <button class="nav-button"><span>◒</span>最近使用</button>
        <button class="nav-button"><span>☆</span>共享中心</button>
        <p class="nav-caption nav-caption-spaced">数据管理</p>
        <button class="nav-button"><span>⇧</span>导入密码库</button>
        <button class="nav-button"><span>⇩</span>导出与备份</button>
        <button class="nav-button"><span>⌫</span>回收站</button>
        <p class="nav-caption nav-caption-spaced">系统设置</p>
        <button class="nav-button"><span>◫</span>偏好设置</button>
        <button class="nav-button"><span>?</span>帮助与支持</button>
      </nav>

      <section class="tag-section">
        <div class="section-label"><span>标签</span><button @click="activeTag = ''">清除</button></div>
        <div class="tags"><button v-for="tag in allTags" :key="tag" :class="{ active: activeTag === tag }" @click="activeTag = activeTag === tag ? '' : tag">{{ tag }}</button></div>
      </section>

      <div class="sidebar-bottom"><span class="online-dot"></span> 本地加密空间</div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div><p class="eyebrow">{{ viewName }}</p><h1>账号密码库</h1></div>
        <div class="toolbar">
          <label class="search"><span>⌕</span><input v-model="search" placeholder="搜索账号、网址或标签"></label>
          <div class="theme-toggle" role="group" aria-label="主题">
            <button :class="{ active: theme === 'light' }" title="浅色主题" @click="theme = 'light'">日</button>
            <button :class="{ active: theme === 'dark' }" title="深色主题" @click="theme = 'dark'">夜</button>
          </div>
          <button class="primary" @click="openEditor()">新增账号</button>
        </div>
      </header>

      <section class="workspace">
        <section class="entry-panel">
          <div class="panel-title"><div><p class="eyebrow">账号列表</p><h2>已保存账号</h2></div><span>{{ visibleEntries.length }} 项</span></div>
          <div class="entry-list">
            <button v-for="entry in visibleEntries" :key="entry.id" class="entry-row" :class="{ selected: selectedId === entry.id }" @click="selectedId = entry.id">
              <span class="site-avatar">{{ entry.name.slice(0, 1) }}</span>
              <span class="entry-copy"><strong>{{ entry.name }}</strong><small>{{ entry.account }} · {{ entry.site }}</small></span>
              <span class="entry-time">{{ entry.updated }}</span>
            </button>
            <p v-if="!visibleEntries.length" class="empty">没有符合当前条件的账号。</p>
          </div>
        </section>

        <aside v-if="selected" class="detail-panel">
          <div class="detail-heading"><div><span class="site-avatar large">{{ selected.name.slice(0, 1) }}</span><div><p class="eyebrow">账号详情</p><h2>{{ selected.name }}</h2><a :href="`https://${selected.site}`" target="_blank" rel="noreferrer">{{ selected.site }}</a></div></div><button class="star" :class="{ active: selected.favorite }" @click="toggleFavorite">★</button></div>
          <dl class="detail-list">
            <div><dt>用户名</dt><dd>{{ selected.account }}<button @click="copy(selected.account, '用户名')">复制</button></dd></div>
            <div><dt>密码</dt><dd><span class="password-mask">••••••••••••</span><button @click="copy(selected.password, '密码')">复制</button></dd></div>
            <div><dt>标签</dt><dd class="tag-values"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></dd></div>
            <div><dt>备注</dt><dd class="note">{{ selected.note || '暂无备注' }}</dd></div>
          </dl>
          <div class="detail-actions"><button class="secondary" @click="openEditor(selected)">编辑账号</button><button class="text-button" @click="showGenerator = true; makePassword()">生成密码</button></div>
        </aside>
      </section>
    </main>

    <div v-if="showEditor" class="modal-backdrop" @click.self="showEditor = false">
      <form class="modal" @submit.prevent="saveEntry"><div class="modal-head"><div><p class="eyebrow">{{ editor.id ? '编辑账号' : '新增账号' }}</p><h2>{{ editor.id ? '更新账号信息' : '保存新的账号' }}</h2></div><button type="button" class="close" @click="showEditor = false">×</button></div>
        <label>名称<input v-model="editor.name" required placeholder="例如 GitHub"></label><label>用户名<input v-model="editor.account" required placeholder="邮箱或登录账号"></label><label>密码<input v-model="editor.password" required placeholder="输入密码"></label><label>网址<input v-model="editor.site" placeholder="example.com"></label><label class="wide">标签<input v-model="editor.tags" placeholder="工作、开发"></label><label class="wide">备注<textarea v-model="editor.note" rows="3" placeholder="可填写双重认证或找回信息"></textarea></label><div class="modal-actions wide"><button type="button" class="secondary" @click="showGenerator = true; makePassword()">密码生成器</button><button class="primary" type="submit">保存账号</button></div>
      </form>
    </div>

    <div v-if="showGenerator" class="modal-backdrop" @click.self="showGenerator = false"><section class="modal generator"><div class="modal-head"><div><p class="eyebrow">实用工具</p><h2>密码生成器</h2></div><button class="close" @click="showGenerator = false">×</button></div><output>{{ generatedPassword }}</output><div class="modal-actions"><button class="secondary" @click="makePassword">重新生成</button><button class="primary" @click="useGeneratedPassword">填入账号</button></div></section></div>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
