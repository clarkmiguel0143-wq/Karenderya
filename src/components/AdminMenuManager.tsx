import { useState } from 'react';
import { MenuItem, DishCategory } from '../types';
import { Plus, RotateCcw, AlertTriangle, Check, Sparkles, X, Edit3 } from 'lucide-react';

interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  onToggleAvailability: (itemId: string) => void;
  onUpdateServings: (itemId: string, newCount: number) => void;
  onUpdatePrice: (itemId: string, newPrice: number) => void;
  onAddNewItem: (item: MenuItem) => void;
  onMorningReset: () => void;
}

export function AdminMenuManager({
  menuItems,
  onToggleAvailability,
  onUpdateServings,
  onUpdatePrice,
  onAddNewItem,
  onMorningReset,
}: AdminMenuManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<DishCategory | 'All'>('All');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Add Item Form State
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('85');
  const [newCategory, setNewCategory] = useState<DishCategory>('Viands');
  const [newServings, setNewServings] = useState('15');
  const [newSpiciness, setNewSpiciness] = useState<'none' | 'mild' | 'spicy'>('none');

  // Preset dish templates
  const PRESET_DISHES: Array<{
    name: string;
    subtitle: string;
    desc: string;
    price: number;
    category: DishCategory;
  }> = [
    {
      name: 'Pork Dinuguan (Crispy)',
      subtitle: 'Savory pork belly stewed in rich, spiced garlic-vinegar gravy',
      desc: 'Savory stew of pork belly chunks simmered in a rich, spicy dark gravy of garlic, chili, and cane vinegar.',
      price: 85,
      category: 'Viands',
    },
    {
      name: 'Beef Kaldereta',
      subtitle: 'Hearty spiced beef stew with liver spread, bell peppers, and potatoes',
      desc: 'Braised beef in spiced tomato sauce with potatoes, bell peppers, olives, and savory liver spread.',
      price: 110,
      category: 'Viands',
    },
    {
      name: 'Ilocano Pinakbet with Bagnet',
      subtitle: 'Steamed native vegetables with crispy pork belly cracklings',
      desc: 'Medley of native bitter melon, eggplant, string beans, and squash cooked in fermented shrimp paste with crispy pork bits.',
      price: 75,
      category: 'Viands',
    },
    {
      name: 'Crispy Lumpiang Shanghai (6 pcs)',
      subtitle: 'Golden fried minced pork spring rolls with sweet chili sauce',
      desc: 'Crispy egg rolls stuffed with seasoned ground pork, carrots, minced onions, and garlic.',
      price: 60,
      category: 'Viands',
    },
    {
      name: 'Ginataang Kalabasa at Sitaw',
      subtitle: 'Squash and yardlong beans simmered in creamy coconut milk and shrimp',
      desc: 'Golden yellow squash and string beans simmered gently in rich coconut cream with prawns.',
      price: 75,
      category: 'Viands',
    },
  ];

  const handleApplyPreset = (preset: (typeof PRESET_DISHES)[0]) => {
    setNewName(preset.name);
    setNewSubtitle(preset.subtitle);
    setNewDesc(preset.desc);
    setNewPrice(preset.price.toString());
    setNewCategory(preset.category);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const created: MenuItem = {
      id: `item-${Date.now()}`,
      name: newName.trim(),
      subtitle: newSubtitle.trim() || 'Freshly cooked daily homestyle dish',
      description: newDesc.trim() || 'Nutritious, authentic homestyle dish prepared fresh daily.',
      price: parseFloat(newPrice) || 85,
      image_url: '',
      category: newCategory,
      is_available: true,
      servings_left: parseInt(newServings) || 15,
      spiciness: newSpiciness,
      date_added: new Date().toISOString(),
    };

    onAddNewItem(created);
    setShowAddModal(false);
    setNewName('');
    setNewSubtitle('');
    setNewDesc('');
  };

  const handleSavePrice = (id: string) => {
    const parsed = parseFloat(tempPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdatePrice(id, parsed);
    }
    setEditingPriceId(null);
  };

  const filteredItems = menuItems.filter((i) => {
    if (selectedFilter === 'All') return true;
    return i.category === selectedFilter;
  });

  const soldOutCount = menuItems.filter((i) => !i.is_available).length;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-lg text-neutral-900">
            Daily Menu & Inventory Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Toggle items to "Sold Out" with a single click as cooking pots and servings run out.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMorningReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
            title="Restock all items for the morning opening"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Morning Restock (Reset All)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
        {(['All', 'Viands', 'Rice', 'Drinks', 'Desserts', 'Soup'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFilter === cat
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {cat} ({menuItems.filter((m) => cat === 'All' || m.category === cat).length})
          </button>
        ))}
      </div>

      {/* Quick Summary Pill Notice */}
      <div className="flex items-center justify-between bg-neutral-100/80 px-4 py-2.5 rounded-xl text-xs text-neutral-600">
        <div className="flex items-center gap-3">
          <span>Total Dishes: <strong>{menuItems.length}</strong> items</span>
          <span>·</span>
          <span>Available: <strong className="text-emerald-700">{menuItems.length - soldOutCount}</strong></span>
          <span>·</span>
          <span>Sold Out: <strong className="text-red-700">{soldOutCount}</strong></span>
        </div>
        <div className="text-[11px] text-neutral-500 italic">
          Tip: Customer menu screens update in real time whenever you toggle an item.
        </div>
      </div>

      {/* Menu Management Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Dish / Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price (₱)</th>
                <th className="px-4 py-3">Portions Left</th>
                <th className="px-4 py-3 text-center">Status / Availability</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-neutral-50/80 transition-colors ${
                    !item.is_available ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Item Name & Details */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-neutral-900 text-sm">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1 italic">
                      {item.subtitle}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 font-medium text-neutral-700">
                    {item.category}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(e.target.value)}
                          className="w-16 px-1.5 py-1 text-xs border border-neutral-300 rounded font-mono"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <span className="tabular-nums">₱{item.price.toFixed(2)}</span>
                        <button
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setTempPrice(item.price.toString());
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-neutral-700"
                          title="Edit price"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Servings Counter */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateServings(item.id, Math.max(0, item.servings_left - 1))}
                        disabled={item.servings_left <= 0}
                        className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 flex items-center justify-center font-bold text-neutral-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold tabular-nums text-neutral-900">
                        {item.servings_left}
                      </span>
                      <button
                        onClick={() => onUpdateServings(item.id, item.servings_left + 1)}
                        className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center font-bold text-neutral-700"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* ONE-CLICK AVAILABILITY TOGGLE */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer ${
                        item.is_available
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-200'
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>SOLD OUT</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Quick Actions */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      className="text-neutral-500 hover:text-amber-800 text-[11px] underline"
                    >
                      {item.is_available ? 'Mark Sold Out' : 'Restock Dish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-base">
                  Add New Homestyle Dish
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Quick Presets */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Quick Presets (Click to autofill)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_DISHES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs rounded-md border border-amber-200 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Dish / Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Beef Kaldereta"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Subtitle / Brief Flavor Note
                  </label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="e.g., Spiced tomato stew with liver spread and vegetables"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as DishCategory)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-white"
                    >
                      <option value="Viands">Viands</option>
                      <option value="Rice">Rice</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Soup">Soup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Price (₱) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="5"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Available Portions (Count)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newServings}
                      onChange={(e) => setNewServings(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Spice Level
                    </label>
                    <select
                      value={newSpiciness}
                      onChange={(e) => setNewSpiciness(e.target.value as 'none' | 'mild' | 'spicy')}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-white"
                    >
                      <option value="none">Not Spicy</option>
                      <option value="mild">Mildly Spicy</option>
                      <option value="spicy">Very Spicy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Ingredients & Details
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short description of ingredients and preparation..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                  >
                    Save to Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
