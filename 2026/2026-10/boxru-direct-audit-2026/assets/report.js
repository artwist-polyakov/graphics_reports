(() => {
  'use strict';
  const data = window.BOXRU_REPORT;
  const $ = (id) => document.getElementById(id);
  const number = (value, digits = 0) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(value);
  const rub = (value) => `${number(value)} ₽`;
  const percent = (value) => `${number(value * 100, 1)}%`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const set = (id, value) => { const element = $(id); if (element) element.textContent = value; };
  const price = (cost, orders) => orders == null ? 'Нет данных' : orders > 0 ? rub(cost / orders) : '—';

  function estimate() {
    const base = $('period-select').value === 'recent' ? data.recent : data.summary;
    const coverage = Number($('coverage').value) / 100;
    const fulfillment = Number($('fulfillment').value) / 100;
    set('coverage-value', percent(coverage));
    set('fulfillment-value', percent(fulfillment));
    set('base-orders', number(base.orders));
    set('base-cost', rub(base.cost));
    set('base-cpa', rub(base.cost / base.orders));
    set('estimated-orders', number(base.orders / coverage));
    set('estimated-cpa', rub(base.cost * coverage / base.orders));
    set('estimated-paid-cpa', rub(base.cost * coverage / base.orders / fulfillment));
  }

  function renderSources() {
    $('source-bars').innerHTML = data.sources.map((source, index) => `
      <div class="source-row">
        <div class="source-title">${esc(source.name)}</div>
        <div class="source-track"><div class="source-fill source-fill-${index}" style="width:${source.share * 100}%"></div></div>
        <div class="source-value"><strong>${percent(source.share)}</strong><span>${number(source.orders)} оформлений</span></div>
      </div>`).join('');
  }

  function renderCategories() {
    const exclude = $('exclude-large').checked;
    const categories = data.categories.map((category) => ({ ...category }));
    if (exclude) {
      const games = categories.find((category) => category.name === 'Игры');
      games.amount -= data.largeOrder.productAmount;
      games.quantity -= data.largeOrder.quantity;
    }
    categories.sort((a, b) => b.amount - a.amount);
    const max = categories[0].amount;
    $('category-bars').innerHTML = categories.slice(0, 8).map((category) => `
      <div class="bar-row">
        <div class="bar-heading"><span>${esc(category.name)}</span><strong>${rub(category.amount)}</strong></div>
        <div class="bar-track"><div class="bar-fill" style="width:${category.amount / max * 100}%"></div></div>
        <div class="bar-meta">${number(category.quantity)} ед.</div>
      </div>`).join('');
    set('category-total', rub(data.summary.productAmount - (exclude ? data.largeOrder.productAmount : 0)));
  }

  let productLimit = 15;
  const sortedProducts = [...data.products].sort((a, b) => b.quantity - a.quantity || b.amount - a.amount);
  function renderProducts() {
    const search = $('product-search').value.trim().toLocaleLowerCase('ru');
    const category = $('product-category').value;
    const filtered = sortedProducts.filter((product) => (!category || product.category === category) &&
      `${product.name} ${product.id} ${product.path}`.toLocaleLowerCase('ru').includes(search));
    const visible = filtered.slice(0, productLimit);
    $('product-body').innerHTML = visible.length ? visible.map((product) => `
      <tr><td><div class="cell-title">${esc(product.name)}</div><div class="cell-sub">Код товара: ${esc(product.id)}</div></td>
      <td>${esc(product.category)}</td><td class="numeric">${number(product.quantity)}</td><td class="numeric">${rub(product.amount)}</td></tr>`).join('') :
      '<tr><td colspan="4" class="empty-state">Товары не найдены. Попробуйте другое название или категорию.</td></tr>';
    set('product-count', `Показано ${visible.length} из ${filtered.length}`);
    $('more-products').hidden = visible.length >= filtered.length;
  }

  function renderCampaigns() {
    const query = $('campaign-search').value.trim().toLocaleLowerCase('ru');
    const mode = $('campaign-filter').value;
    const sorting = $('campaign-sort').value;
    const campaigns = data.campaigns.filter((campaign) =>
      (mode !== 'spending' || campaign.cost > 0) && (mode !== 'orders' || campaign.orders > 0) &&
      `${campaign.name} ${campaign.originalName} ${campaign.id}`.toLocaleLowerCase('ru').includes(query));
    campaigns.sort((a, b) => {
      if (sorting === 'orders') return (b.orders ?? -1) - (a.orders ?? -1) || b.cost - a.cost;
      if (sorting === 'cpa') return (a.orders ? a.cost / a.orders : Infinity) - (b.orders ? b.cost / b.orders : Infinity) || b.cost - a.cost;
      return b.cost - a.cost;
    });
    $('campaign-body').innerHTML = campaigns.length ? campaigns.map((campaign) => `
      <tr><td><div class="cell-title">${esc(campaign.name)}</div><div class="cell-sub">№ ${esc(campaign.id)}</div></td>
      <td class="numeric">${number(campaign.clicks)}</td><td class="numeric">${rub(campaign.cost)}</td>
      <td class="numeric">${campaign.orders == null ? 'Нет данных' : number(campaign.orders)}</td>
      <td class="numeric">${price(campaign.cost, campaign.orders)}</td>
      <td><div class="cell-title">${campaign.recentOrders == null ? 'Нет данных' : `${number(campaign.recentOrders)} оформл.`}</div><div class="cell-sub">${price(campaign.recentCost, campaign.recentOrders)}</div></td></tr>`).join('') :
      '<tr><td colspan="6" class="empty-state">Кампании не найдены. Измените поиск или фильтр.</td></tr>';
    set('campaign-count', `${campaigns.length} из ${data.campaigns.length} кампаний`);
  }

  function renderMonths() {
    const labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'];
    const fullLabels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь'];
    const max = Math.max(...data.months.map((month) => month.cost / month.orders));
    $('monthly-chart').innerHTML = data.months.map((month, index) => {
      const cpa = month.cost / month.orders;
      return `<div class="month-column" title="${fullLabels[index]}: ${rub(cpa)} за оформление, ${month.orders} заказов">
        <span class="month-value">${number(cpa)}</span><div class="month-track"><div class="month-bar${index === 3 ? ' month-bar-best' : ''}" style="height:${cpa / max * 100}%"></div></div>
        <span class="month-name">${labels[index]}${index === 9 ? '*' : ''}</span></div>`;
    }).join('');
    $('monthly-body').innerHTML = data.months.map((month, index) => `<tr><td>${fullLabels[index]}${index === 9 ? ', по 22-е число' : ''}</td><td class="numeric">${rub(month.cost)}</td><td class="numeric">${number(month.orders)}</td><td class="numeric">${rub(month.cost / month.orders)}</td></tr>`).join('');
  }

  function growth() {
    const base = data.recent;
    const growthRate = Number($('growth').value) / 100;
    const marginalMultiplier = Number($('marginal-cost').value) / 100;
    const initialPrice = base.cost / base.orders;
    const extraCost = base.cost * growthRate;
    const extraOrders = extraCost / (initialPrice * marginalMultiplier);
    set('growth-value', percent(growthRate));
    set('marginal-value', marginalMultiplier === 1 ? 'как сейчас' : marginalMultiplier < 1 ? `на ${number((1 - marginalMultiplier) * 100)}% дешевле` : `на ${number((marginalMultiplier - 1) * 100)}% дороже`);
    set('growth-spend', rub(extraCost));
    set('growth-orders', `≈ ${number(extraOrders, 1)}`);
    set('growth-cpa', rub((base.cost + extraCost) / (base.orders + extraOrders)));
  }

  $('period-select').addEventListener('change', estimate);
  $('coverage').addEventListener('input', estimate);
  $('fulfillment').addEventListener('input', estimate);
  $('reset-estimate').addEventListener('click', () => {
    $('period-select').value = 'year'; $('coverage').value = 50; $('fulfillment').value = 75; estimate();
  });
  $('exclude-large').addEventListener('change', renderCategories);
  const categorySelect = $('product-category');
  [...new Set(data.products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'ru')).forEach((category) => {
    const option = document.createElement('option'); option.value = category; option.textContent = category; categorySelect.append(option);
  });
  for (const id of ['product-search', 'product-category']) $(id).addEventListener(id === 'product-search' ? 'input' : 'change', () => { productLimit = 15; renderProducts(); });
  $('more-products').addEventListener('click', () => { productLimit += 30; renderProducts(); });
  for (const id of ['campaign-search', 'campaign-filter', 'campaign-sort']) $(id).addEventListener(id === 'campaign-search' ? 'input' : 'change', renderCampaigns);
  $('growth').addEventListener('input', growth);
  $('marginal-cost').addEventListener('input', growth);
  $('print-report')?.addEventListener('click', () => window.print());
  estimate(); renderSources(); renderCategories(); renderProducts(); renderCampaigns(); renderMonths(); growth();
})();
