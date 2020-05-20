
const routes = [
  {
    path: '/',
    component: () => import('pages/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Main.vue') }
    ]
  }
]

export default routes
