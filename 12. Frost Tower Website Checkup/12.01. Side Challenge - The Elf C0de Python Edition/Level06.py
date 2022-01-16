import elf, munchkins, levers, lollipops, yeeters, pits
elf.moveUp(2)
lever = levers.get(0)
data = lever.data()
if type(data) == bool:
    data = not data
elif type(data) == int:
    data = data * 2 
lever.pull(data)
elf.moveUp(100)