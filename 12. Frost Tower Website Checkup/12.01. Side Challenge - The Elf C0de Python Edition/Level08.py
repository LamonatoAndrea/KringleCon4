import elf, munchkins, levers, lollipops, yeeters, pits
m0 = munchkins.get(0)
ask = m0.ask()
for k in ask.keys():
    if ask[k] == "lollipop":
        m0.answer(k)
all_lollipops = lollipops.get()
for lollipop in all_lollipops:
    elf.moveTo(lollipop.position)
elf.moveLeft(8)
elf.moveUp(100)